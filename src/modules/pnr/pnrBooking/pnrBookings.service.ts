import { Injectable, Inject, HttpStatus } from '@nestjs/common';
import { PnrBookingDto } from './dto/create-pnrBooking.dto';
import { AxiosResponse } from 'axios';
import * as mailgun from 'mailgun-js';
import * as moment from 'moment';
import * as momenttimezone from 'moment-timezone';
// Test COmmit
// import { PnrBookingArrayDto } from './dto/PnrBookingArray.dto';
import * as qs from 'qs';

// import { UpdateVoucherDto } from './dto/update-vouchers.dto';
// Test
import {
  SAVED_SUCCESS,
  GET_SUCCESS,
  AUTHENTICATION_ERROR,
} from 'src/modules/../shared/messages.constants';
import { PNR_BOOKINGS_REPOSITORY } from 'src/modules/../shared/constants';
import { PnrBooking } from './entities/pnrBooking.entity';
import { PnrDetail } from '../pnrDetails';
import { User } from 'src/modules//generalModules/users/entities/user.entity';
import {
  Op,
  sequelize,
  Transaction,
} from 'src/modules/../database/sequelize.provider'; // Adjust the path accordingly
import { ResponseService } from 'src/modules/../common/utility/response/response.service';
import { FlightDetails } from '../flightDetails';
import { ExtraBaggage } from '../extraBaggage';
import { BaggageAllowance } from '../baggageAllowance';
import { BookingFlight } from '../bookingFlight';
import { GroupDescription } from '../groupDescription';
import { FlightSegments } from '../flightSegments';
import { Fare } from '../fare';
import { PassengerInfoList } from '../passengerInfoList';
import { PassengerInfo } from '../passengerInfo';
import { CurrencyConversion } from '../currencyConversion';
import { SchedualDetGet } from '../schedualDetGet';
import { InnerSchedualDetGet } from '../InnerSchedualDetGet';
import { TotalFare } from '../totalFare';
import { Carrier } from '../carrier';
import { Departure } from '../departure';
import { Arrival } from '../arrival';
import { Equipment } from '../equipment';
import { PnrServiceCharges } from 'src/modules/serviceCharges/pnrServiceCharges';
import { CommissionPercentage } from 'src/modules/serviceCharges/commissionPercentage/entities/commissionPercentage.entity';
import { Sector } from 'src/modules/serviceCharges/sector';
import { FareClass } from 'src/modules/serviceCharges/fareClass';
import { Airline } from 'src/modules/serviceCharges/airline';
import { Promotion } from 'src/modules/generalModules/promotions/entities/promotion.entity';
import { CommissionCategories } from 'src/modules/serviceCharges/CommissionCategories';
import { PnrPayment } from 'src/modules/paymentModules/paymob/entities/pnrPayment.entity';
import { HttpService } from '@nestjs/axios';
import { GeneralTask } from 'src/modules/generalModules/generalTasks/entities/generalTask.entity';
require('dotenv').config();
import { Log } from 'src/modules/generalModules/systemLogs/entities/log.entity';

@Injectable()
export class PnrBookingsService {
  private tokenSabre: string | null = null;
  private tokenExpirationSabre: Date | null = null;
  private keySabre =
    process.env.KEY_SABRE || 'VmpFNk5UVTFOVG8wTTBWRU9rRkI6YzNOM2NtVnpPVGs9';
  constructor(
    @Inject(PNR_BOOKINGS_REPOSITORY)
    private pnrBookingRepository: typeof PnrBooking,
    private readonly responseService: ResponseService,
    private readonly httpService: HttpService,
  ) {}
  async create(
    currentUserId: number,
    isCurrentUserAdmin: number,
    pnrBookingDto: PnrBookingDto,
  ): Promise<any> {
    let MessageLog = `1)  Start done: ${new Date().toISOString()}`;
    console.log('currentUserId', currentUserId);
    let newLog = await Log.create({
      level: '1',
      message: MessageLog,
      meta: `${pnrBookingDto.pnr}`,
      timestamp: new Date().toISOString(),
    });

    const t: Transaction = await sequelize.transaction();
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const {
        pnrBookings,
        pnr,
        OrderId,
        // phoneNumber,
        // countryCode,
        Amount,
        flightDetails,
        MajorInfo,
        // leadCreationData,
        sendSmsBranch,
        sendSmsCod,
        branchLabel,
        userLocation,
      } = pnrBookingDto;
      const tolerance = 0.001; // Define your tolerance threshold here
      const baseFare =
        typeof Amount !== 'undefined' ? parseFloat(Amount.BaseFare) || 0 : 0;
      const taxAmount =
        typeof Amount !== 'undefined' ? parseFloat(Amount.taxAmount) || 0 : 0;
      const pnrPayment =
        typeof Amount !== 'undefined' ? parseFloat(Amount.pnrPayment) || 0 : 0;

      const isAmountEqual =
        Math.abs(baseFare + taxAmount - pnrPayment) < tolerance;
      const newPnrBookingRepository = await this.pnrBookingRepository.create(
        {
          userId: currentUserId,
          pnr: pnr,
          orderId: OrderId,
          sendSmsBranch: sendSmsBranch || false,
          sendSmsCod: sendSmsCod || false,
          branchLabel: branchLabel || '',
          BaseFare: Amount.BaseFare || 0,
          ServiceCharges: Amount.ServiceCharges || 0,
          pnrPaymentAmount: Amount.pnrPayment || 0,
          taxAmount: Amount.taxAmount || 0,
          totalTicketPrice: Amount.totalTicketPrice || 0,
        },
        { transaction: t },
      );

      const userUpdateEmail = await User.findByPk(currentUserId);
      if (userUpdateEmail) {
        userUpdateEmail.email =
          pnrBookings[0].userEmail || userUpdateEmail.email;
        await userUpdateEmail.save({ transaction: t });
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      MessageLog = `2) newPnrBookingRepository api done: ${new Date().toISOString()}`;
      let newLog = await Log.create({
        level: '1',
        message: MessageLog,
        meta: `${pnrBookingDto.pnr}`,
        timestamp: new Date().toISOString(),
      });

      if (pnrBookings.length > 0) {
        await Promise.all(
          pnrBookings.map(async (pnrBooking) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const newPnrDetails = await PnrDetail.create(
              {
                pnrBookingId: newPnrBookingRepository.id,
                phoneNumber: pnrBooking.phoneNumber,
                email: pnrBooking.email,
                dateOfBirth: moment(
                  pnrBooking.dateOfBirth,
                  'DD-MM-YYYY',
                ).format('yyyy-MM-DD'),
                passportExpiryDate: moment(
                  pnrBooking.passportExpiryDate,
                  'DD-MM-YYYY',
                ).format('yyyy-MM-DD'),
                firstName: pnrBooking.firstName,
                lastName: pnrBooking.lastName,
                gender: pnrBooking.gender,
                cnic: pnrBooking.cnic,
                passportNo: pnrBooking.passportNo,
              },
              { transaction: t },
            );

            // await this.callLeadCreation(leadCreationData, pnrBooking);
            // external api
          }),
        );
        MessageLog = `3) newPnrDetails api done: ${new Date().toISOString()}`;
        let newLog = await Log.create({
          level: '1',
          message: MessageLog,
          meta: `${pnrBookingDto.pnr}`,
          timestamp: new Date().toISOString(),
        });
      }

      if (flightDetails) {
        const newflightDetails = await FlightDetails.create(
          {
            pnrBookingId: newPnrBookingRepository.id,
            adults: flightDetails.adults,
            children: flightDetails.children,
            infants: flightDetails.infants,
            classtype: flightDetails.classtype,
            pricingSubsource: flightDetails.pricingSubsource,
            seatsAvailables: flightDetails.seatsAvailables,
            price: flightDetails.price,
          },
          { transaction: t },
        );
        MessageLog = `4) newflightDetails api done: ${new Date().toISOString()}`;
        let newLog = await Log.create({
          level: '1',
          message: MessageLog,
          meta: `${pnrBookingDto.pnr}`,
          timestamp: new Date().toISOString(),
        });
        if (
          flightDetails.extraBaggages &&
          flightDetails.extraBaggages.length > 0
        ) {
          await Promise.all(
            flightDetails.extraBaggages.map(async (extraBaggage) => {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const newExtraBaggage = await ExtraBaggage.create(
                {
                  flightDetailsId: newflightDetails.id,
                  SUB_CLASS_ID: extraBaggage.SUB_CLASS_ID,
                  SUB_CLASS_DESC: extraBaggage.SUB_CLASS_DESC,
                  ABBR: extraBaggage.ABBR,
                  NO_OF_BAGS: extraBaggage.NO_OF_BAGS,
                  ADV_TAX: extraBaggage.ADV_TAX,
                  AMOUNT: extraBaggage.AMOUNT,
                  ACTUAL_AMOUNT: extraBaggage.ACTUAL_AMOUNT,
                  WEIGHT: extraBaggage.WEIGHT,
                  PIECE: extraBaggage.PIECE,
                  DESCRIPTION: extraBaggage.DESCRIPTION,
                },
                { transaction: t },
              );
            }),
          );
        }
        MessageLog = `5) newExtraBaggage api done: ${new Date().toISOString()}`;
        newLog = await Log.create({
          level: '1',
          message: MessageLog,
          meta: `${pnrBookingDto.pnr}`,
          timestamp: new Date().toISOString(),
        });
        if (flightDetails.baggageAllowance.length > 0) {
          await Promise.all(
            flightDetails.baggageAllowance.map(async (baggageAllowance) => {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const newBaggageAllowance = await BaggageAllowance.create(
                {
                  flightDetailsId: newflightDetails.id,
                  id: baggageAllowance.id,
                  unit: baggageAllowance.unit,
                  weight: baggageAllowance.weight,
                },
                { transaction: t },
              );
            }),
          );
        }
        MessageLog = `6) newBaggageAllowance api done: ${new Date().toISOString()}`;
        newLog = await Log.create({
          level: '1',
          message: MessageLog,
          meta: `${pnrBookingDto.pnr}`,
          timestamp: new Date().toISOString(),
        });

        if (
          flightDetails.bookingFlight &&
          flightDetails.bookingFlight.length > 0
        ) {
          await Promise.all(
            flightDetails.bookingFlight.map(async (bookingFlightItem) => {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const newBookingFlight = await BookingFlight.create(
                {
                  flightDetailsId: newflightDetails.id,
                  id: bookingFlightItem.id,
                  JOURNEY_CODE: bookingFlightItem.JOURNEY_CODE,
                  CLASS_CODE: bookingFlightItem.CLASS_CODE,
                  FareType: bookingFlightItem.FareType,
                },
                { transaction: t },
              );
            }),
          );
        }
        MessageLog = `7) newBookingFlight api done: ${new Date().toISOString()}`;
        newLog = await Log.create({
          level: '1',
          message: MessageLog,
          meta: `${pnrBookingDto.pnr}`,
          timestamp: new Date().toISOString(),
        });
        if (flightDetails.groupDescription.length > 0) {
          await Promise.all(
            flightDetails.groupDescription.map(async (groupDescriptionItem) => {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const newGroupDescription = await GroupDescription.create(
                {
                  flightDetailsId: newflightDetails.id,
                  arrivalLocation: groupDescriptionItem.arrivalLocation,
                  departureDate: groupDescriptionItem.departureDate,
                  departureLocation: groupDescriptionItem.departureLocation,
                },
                { transaction: t },
              );
            }),
          );
        }
        MessageLog = `8) newGroupDescription api done: ${new Date().toISOString()}`;
        newLog = await Log.create({
          level: '1',
          message: MessageLog,
          meta: `${pnrBookingDto.pnr}`,
          timestamp: new Date().toISOString(),
        });
        if (flightDetails.flightSegments.length > 0) {
          await Promise.all(
            flightDetails.flightSegments.map(async (flightSegment) => {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const newFlightSegment = await FlightSegments.create(
                {
                  flightDetailsId: newflightDetails.id,
                  departure: flightSegment.departure,
                  arrival: flightSegment.arrival,
                  date: flightSegment.date,
                },
                { transaction: t },
              );
            }),
          );
        }
        MessageLog = `9) newFlightSegment api done: ${new Date().toISOString()}`;
        newLog = await Log.create({
          level: '1',
          message: MessageLog,
          meta: `${pnrBookingDto.pnr}`,
          timestamp: new Date().toISOString(),
        });
        if (flightDetails.fare) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const newFare = await Fare.create(
            {
              flightDetailsId: newflightDetails.id,
              eTicketable: flightDetails.fare.eTicketable,
              governingCarriers: flightDetails.fare.governingCarriers,
              lastTicketDate: flightDetails.fare.lastTicketDate,
              lastTicketTime: flightDetails.fare.lastTicketTime,
              validatingCarrierCode: flightDetails.fare.validatingCarrierCode,
              vita: flightDetails.fare.vita,
            },
            { transaction: t },
          );
          MessageLog = `10) newFare api done: ${new Date().toISOString()}`;
          newLog = await Log.create({
            level: '1',
            message: MessageLog,
            meta: `${pnrBookingDto.pnr}`,
            timestamp: new Date().toISOString(),
          });
          if (flightDetails.fare.totalFare) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const newTotalFare = await TotalFare.create(
              {
                fareId: newFare.id,
                baseFareAmount: flightDetails.fare.totalFare.baseFareAmount,
                baseFareCurrency: flightDetails.fare.totalFare.baseFareCurrency,
                constructionAmount:
                  flightDetails.fare.totalFare.constructionAmount,
                constructionCurrency:
                  flightDetails.fare.totalFare.constructionCurrency,
                currency: flightDetails.fare.totalFare.currency,
                equivalentAmount: flightDetails.fare.totalFare.equivalentAmount,
                equivalentCurrency:
                  flightDetails.fare.totalFare.equivalentCurrency,
                totalPrice: flightDetails.fare.totalFare.totalPrice,
                totalTaxAmount: flightDetails.fare.totalFare.totalTaxAmount,
              },
              { transaction: t },
            );
          }
          MessageLog = `11) newTotalFare api done: ${new Date().toISOString()}`;
          newLog = await Log.create({
            level: '1',
            message: MessageLog,
            meta: `${pnrBookingDto.pnr}`,
            timestamp: new Date().toISOString(),
          });
          if (flightDetails.fare.passengerInfoList.length > 0) {
            await Promise.all(
              flightDetails.fare.passengerInfoList.map(
                async (passengerInfoList) => {
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  const newPassengerInfoList = await PassengerInfoList.create(
                    {
                      fareId: newFare.id,
                    },
                    { transaction: t },
                  );
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  const newPassengerInfo = await PassengerInfo.create(
                    {
                      passengerInfoListId: newPassengerInfoList.id,
                      nonRefundable:
                        passengerInfoList.passengerInfo.nonRefundable,
                      passengerNumber:
                        passengerInfoList.passengerInfo.passengerNumber,
                      passengerType:
                        passengerInfoList.passengerInfo.passengerType,
                    },
                    { transaction: t },
                  );
                  if (passengerInfoList.passengerInfo.currencyConversion) {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const newCurrencyConversion =
                      await CurrencyConversion.create(
                        {
                          passengerInfoId: newPassengerInfo.id,
                          from: passengerInfoList.passengerInfo
                            .currencyConversion.from,
                          to: passengerInfoList.passengerInfo.currencyConversion
                            .to,
                          exchangeRateUsed:
                            passengerInfoList.passengerInfo.currencyConversion
                              .exchangeRateUsed,
                        },
                        { transaction: t },
                      );
                  }
                },
              ),
            );
          }
          MessageLog = `12) flightDetails.fare.passengerInfoList api done: ${new Date().toISOString()}`;
          newLog = await Log.create({
            level: '1',
            message: MessageLog,
            meta: `${pnrBookingDto.pnr}`,
            timestamp: new Date().toISOString(),
          });
        }
        if (flightDetails.schedualDetGet.length > 0) {
          await Promise.all(
            flightDetails.schedualDetGet.map(async (schedualDetGet) => {
              const newSchedualDetGet = await SchedualDetGet.create(
                {
                  flightDetailsId: newflightDetails.id,
                },
                { transaction: t },
              );
              await Promise.all(
                schedualDetGet.map(async (schedualDetGetInner) => {
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  const newInnerSchedualDetGet =
                    await InnerSchedualDetGet.create(
                      {
                        schedualDetGetId: newSchedualDetGet.id,
                        id: schedualDetGetInner.id,
                        frequency: schedualDetGetInner.frequency,
                        stopCount: schedualDetGetInner.stopCount,
                        eTicketable: schedualDetGetInner.eTicketable,
                        totalMilesFlown: schedualDetGetInner.totalMilesFlown,
                        elapsedTime: schedualDetGetInner.elapsedTime,
                      },
                      { transaction: t },
                    );
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  const newArrival = await Arrival.create(
                    {
                      innerSchedualDetGetId: newInnerSchedualDetGet.localId,
                      airport: schedualDetGetInner.arrival.airport,
                      city: schedualDetGetInner.arrival.city,
                      country: schedualDetGetInner.arrival.country,
                      terminal: schedualDetGetInner.arrival.terminal,
                      time: schedualDetGetInner.arrival.time,
                    },
                    { transaction: t },
                  );
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  const newDeparture = await Departure.create(
                    {
                      innerSchedualDetGetId: newInnerSchedualDetGet.localId,
                      airport: schedualDetGetInner.departure.airport,
                      city: schedualDetGetInner.departure.city,
                      country: schedualDetGetInner.departure.country,
                      terminal: schedualDetGetInner.departure.terminal,
                      time: schedualDetGetInner.departure.time,
                    },
                    { transaction: t },
                  );
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  const newCarrier = await Carrier.create(
                    {
                      innerSchedualDetGetId: newInnerSchedualDetGet.localId,
                      marketing: schedualDetGetInner.carrier.marketing,
                      marketingFlightNumber:
                        schedualDetGetInner.carrier.marketingFlightNumber,
                      operating: schedualDetGetInner.carrier.operating,
                      operatingFlightNumber:
                        schedualDetGetInner.carrier.operatingFlightNumber,
                    },
                    { transaction: t },
                  );
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  const newEquipment = await Equipment.create(
                    {
                      carrierId: newCarrier.id,
                      code: schedualDetGetInner.carrier.equipment.code,
                      typeForFirstLeg:
                        schedualDetGetInner.carrier.equipment.typeForFirstLeg,
                      typeForLastLeg:
                        schedualDetGetInner.carrier.equipment.typeForLastLeg,
                    },
                    { transaction: t },
                  );
                }),
              );
            }),
          );
        }
        MessageLog = `13) newSchedualDetGet api done: ${new Date().toISOString()}`;
        newLog = await Log.create({
          level: '1',
          message: MessageLog,
          meta: `${pnrBookingDto.pnr}`,
          timestamp: new Date().toISOString(),
        });
      }
      const commissionCategory = await CommissionCategories.findOne({
        order: [['precedence', 'ASC']],
      });

      if (commissionCategory) {
        MessageLog = `14)  if (commissionCategory) True: ${new Date().toISOString()}`;
        newLog = await Log.create({
          level: '1',
          message: MessageLog,
          meta: `${pnrBookingDto.pnr}`,
          timestamp: new Date().toISOString(),
        });
        let pnrServiceChargesPercentage = 0;

        const commissionPercentage = await CommissionPercentage.findOne({
          where: {
            airlineId: null,
            fareClassId: null,
            sectorId: null,
          },
        });
        MessageLog = `15)  commissionPercentage Find ${new Date().toISOString()}`;
        newLog = await Log.create({
          level: '1',
          message: MessageLog,
          meta: `${pnrBookingDto.pnr}`,
          timestamp: new Date().toISOString(),
        });
        if (commissionPercentage) {
          pnrServiceChargesPercentage = commissionPercentage.percentage;
        }
        let pnrServiceChargesCode = 'unknownCode';
        // let a = 1;
        MessageLog = `16)   Before Switch:commissionCategory.id ${Number(
          commissionCategory.id,
        )} ${new Date().toISOString()}`;
        newLog = await Log.create({
          level: '1',
          message: MessageLog,
          meta: `${pnrBookingDto.pnr}`,
          timestamp: new Date().toISOString(),
        });
        switch (Number(commissionCategory.id)) {
          case 1:
            pnrServiceChargesCode = MajorInfo.OperatingAirline[0] ?? null;

            const airline = await Airline.findOne({
              where: { code: pnrServiceChargesCode },
            });

            if (airline) {
              const commissionPercentage = await CommissionPercentage.findOne({
                where: {
                  airlineId: airline.id,
                  fareClassId: null,
                  sectorId: null,
                },
              });
              if (commissionPercentage) {
                pnrServiceChargesPercentage = commissionPercentage.percentage;
              }
            }
            MessageLog = `17)  case 1 :pnrServiceChargesPercentage:${pnrServiceChargesPercentage} -- ${new Date().toISOString()}`;
            newLog = await Log.create({
              level: '1',
              message: MessageLog,
              meta: `${pnrBookingDto.pnr}`,
              timestamp: new Date().toISOString(),
            });
            break;

          case 2:
            pnrServiceChargesCode = MajorInfo.Destinations[0] ?? null;
            const sector = await Sector.findOne({
              where: { code: pnrServiceChargesCode },
            });

            if (sector) {
              const commissionPercentage = await CommissionPercentage.findOne({
                where: {
                  sectorId: sector.id,
                  airlineId: null,
                  fareClassId: null,
                },
              });

              if (commissionPercentage) {
                pnrServiceChargesPercentage = commissionPercentage.percentage;
              }
            }
            MessageLog = `19)  case 2 :pnrServiceChargesPercentage:${pnrServiceChargesPercentage} --${new Date().toISOString()}`;
            newLog = await Log.create({
              level: '1',
              message: MessageLog,
              meta: `${pnrBookingDto.pnr}`,
              timestamp: new Date().toISOString(),
            });
            break;
          case 3:
            pnrServiceChargesCode = MajorInfo.ClassType[0] ?? null;

            const fareClass = await FareClass.findOne({
              where: { code: pnrServiceChargesCode },
            });

            if (fareClass) {
              const commissionPercentage = await CommissionPercentage.findOne({
                where: {
                  fareClassId: fareClass.id,
                  sectorId: null,
                  airlineId: null,
                },
              });

              if (commissionPercentage) {
                pnrServiceChargesPercentage = commissionPercentage.percentage;
              }
            }
            MessageLog = `20)  case 3:pnrServiceChargesPercentage:${pnrServiceChargesPercentage} --${new Date().toISOString()}`;
            newLog = await Log.create({
              level: '1',
              message: MessageLog,
              meta: `${pnrBookingDto.pnr}`,
              timestamp: new Date().toISOString(),
            });
            break;

          default:
            pnrServiceChargesPercentage = 0;
            MessageLog = `21)  case default:pnrServiceChargesPercentage:${pnrServiceChargesPercentage}-- ${new Date().toISOString()}`;
            newLog = await Log.create({
              level: '1',
              message: MessageLog,
              meta: `${pnrBookingDto.pnr}`,
              timestamp: new Date().toISOString(),
            });
            break;
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const newPnrServiceCharges = await PnrServiceCharges.create(
          {
            pnrBookingId: newPnrBookingRepository.id,
            commissionCategoryId: commissionCategory.id,
            percentage: pnrServiceChargesPercentage,
            code: pnrServiceChargesCode,
          },
          { transaction: t },
        );
      }
      MessageLog = `22)  newPnrServiceCharges api done ${new Date().toISOString()}`;
      newLog = await Log.create({
        level: '1',
        message: MessageLog,
        meta: `${pnrBookingDto.pnr}`,
        timestamp: new Date().toISOString(),
      });
      await t.commit();

      const user = await User.findByPk(currentUserId);
      MessageLog = `23)  Find user api done ${new Date().toISOString()}`;
      newLog = await Log.create({
        level: '1',
        message: MessageLog,
        meta: `${pnrBookingDto.pnr}`,
        timestamp: new Date().toISOString(),
      });
      if (user) {
        MessageLog = `24)  user Found  ${new Date().toISOString()}`;
        newLog = await Log.create({
          level: '1',
          message: MessageLog,
          meta: `${pnrBookingDto.pnr}`,
          timestamp: new Date().toISOString(),
        });
        if (sendSmsBranch) {
          MessageLog = `25)if (sendSmsBranch) { ${new Date().toISOString()}`;
          newLog = await Log.create({
            level: '1',
            message: MessageLog,
            meta: `${pnrBookingDto.pnr}`,
            timestamp: new Date().toISOString(),
          });
          const message = `Your booking for ${
            flightDetails.groupDescription[0]?.departureLocation
          }-${
            flightDetails.groupDescription[0]?.arrivalLocation
          } priced PKR ${Amount.totalTicketPrice.toLocaleString()} has been placed. Please visit your selected branch in working hours to make payment and complete your booking within time limit`;
          const resultSms = await this.sendSmsConfirmation(
            { phoneNumber: user.phoneNumber, countryCode: user.countryCode },
            message,
          );
          if (resultSms) {
            console.log('SMS sent successfully');
          } else {
            console.error('Failed to send SMS');
          }
        }
        if (sendSmsCod) {
          MessageLog = `26)if (sendSmsCod) { ${new Date().toISOString()}`;
          newLog = await Log.create({
            level: '1',
            message: MessageLog,
            meta: `${pnrBookingDto.pnr}`,
            timestamp: new Date().toISOString(),
          });
          const message = `Hello Ticket Pay by COD (Testing).${
            !sendSmsCod && !sendSmsBranch ? `PNR generated: ${pnr}` : ''
          }`;
          const resultSms = await this.sendSmsConfirmation(
            { phoneNumber: user.phoneNumber, countryCode: user.countryCode },
            message,
          );
          if (resultSms) {
            console.log('SMS sent successfully');
          } else {
            console.error('Failed to send SMS');
          }
        }
      }
      // Email to client Start
      await this.sendBookingEmail(
        pnrBookingDto,
        userUpdateEmail,
        newPnrBookingRepository.id,
        pnr,
      );
      // Email to client End
      MessageLog = `27)Done Execution { ${new Date().toISOString()}`;
      newLog = await Log.create({
        level: '1',
        message: MessageLog,
        meta: `${pnrBookingDto.pnr}`,
        timestamp: new Date().toISOString(),
      });
      return this.responseService.createResponse(
        HttpStatus.OK,
        // {},
        { isAmountEqual, newPnrBookingRepository },
        SAVED_SUCCESS,
      );
    } catch (error) {
      console.log('Error', error.message);
      // Log the error
      try {
        await Log.create({
          level: '5',
          message: `28) INTERNAL_SERVER_ERROR Caught: --------${MessageLog}---- ${new Date().toISOString()},- ${error.message}`,
          meta: `${pnrBookingDto.pnr}`,
          timestamp: new Date().toISOString(),
        });
      } catch (logError) {
        console.error('Logging error:', logError.message);
      }

      // Attempt to rollback the transaction if it was started
      // if (t.finished !== 'commit') {
      try {
        await t.rollback();
      } catch (rollbackError) {
        console.error('Rollback error:', rollbackError.message);
      }
      // }

      return this.responseService.createResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        { isAmountEqual: false },
        error.message,
      );
    }
  }

  async sendBookingEmail(
    bookingData,
    user,
    referenceNumber,
    pnr,
  ): Promise<any> {
    const message2 = `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Ticket Reservation (Awaiting Payment) - Faremakers</title>
      <style>
        body {
          font-family: Arial, sans-serif;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          border: 1px solid #ccc;
        }
        h1, h2, h3 {
          color: #333;
        }
        p {
          margin-bottom: 10px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        th {
          background-color: #f2f2f2;
        }
        .link {
          display: inline-block;
          margin-top: 20px;
          background-color: #007bff;
          color: #fff;
          text-decoration: none;
          padding: 10px 20px;
          border-radius: 5px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2> 
        Your booking for Reference # ${referenceNumber} ( ${
          bookingData.flightDetails.groupDescription[0]?.departureLocation
        }-${
          bookingData.flightDetails.groupDescription[0]?.arrivalLocation
        } ) is Awaiting Payment.
        </h2>
        <p>Hi!  ${user.phoneNumber},</p>
        <p>Please check details in the following link.  </p>
        <br>Your registered information for this booking are following:
        <br>Email:  ${user.email} 
        <br>Contact Number:  ${user.phoneNumber} 
        <br>
        <p>Your registered information for this booking:</p>
        <ul>
          <li>Email: ${user?.email}</li>
          <li>Contact Number: ${user.phoneNumber}</li>
        </ul>
        <div>
          <h3>Amount Due:</h3>
          <table>
            <tr>
              <th>Method</th>
              <td>
              ${
                !bookingData.sendSmsCod && !bookingData.sendSmsBranch
                  ? 'Card Payment'
                  : ''
              }
                ${
                  bookingData.sendSmsCod && !bookingData.sendSmsBranch
                    ? 'Cash On Delivery'
                    : ''
                }
                ${
                  !bookingData.sendSmsCod && bookingData.sendSmsBranch
                    ? 'Pay at Branch'
                    : ''
                }
                </td>
            </tr>
            <tr>
              <th>Total Amount Due</th>
              <td>${bookingData.Amount.totalTicketPrice.toLocaleString()}</td>
            </tr>
          </table>
        </div>
                <p>Best regards,<br>faremakers</p>
      </div>
    </body>
    </html>
    `;
    const toAddresses = ['travelchannel786@hotmail.com'];
    if (user?.email) {
      toAddresses.push(user.email);
    }
    const bccAddresses = ['bilal.tariq@faremakers.com', 'arman@faremakers.com'];
    const mailSubject = 'Ticket Reservation (Awaiting Payment) - Faremakers';
    const htmlBody = `${message2}`;
    const resultEmail = await this.sendEmailConfirmation(
      toAddresses,
      bccAddresses,
      mailSubject,
      htmlBody,
      pnr,
    );
    if (resultEmail) {
      console.log('Email sent successfully');
    } else {
      console.error('Failed to send email');
    }
  }
  async callLeadCreation(leadCreationData, data): Promise<any> {
    const headers = {
      'Content-Type': 'application/json',
      // Authorization: `Bearer ${tokenSabre}`,
    };
    const returnDate = moment(leadCreationData.returnDate).format('DD-MM-yyyy');
    const departDate = moment(leadCreationData.departDate).format('DD-MM-yyyy');
    const url = `https://fmcrm.azurewebsites.net/Handlers/FMConnectApis.ashx?type=89&Username=WEBONLN&from=${leadCreationData.depart}&to=${leadCreationData.arrival}&name=${data.firstName} ${data.lastName}&phone=0${leadCreationData.phoneNumber}&email=${data.userEmail}&adult=${leadCreationData.adult}&child=${leadCreationData.child}&infant=${leadCreationData.infants}&airline=${leadCreationData.airline}&classtype=${leadCreationData.classType}&tripType=1&depDate=${departDate}&retDate=${returnDate}`;
    const response = await this.httpService.get(url, { headers }).toPromise();
    const result = response.data;

    return result;
  }
  async findAllbK(
    req,
    currentUserId: number,
    isCurrentUserAdmin: number,
  ): Promise<any> {
    try {
      const whereOptions: any = {};
      if (!isCurrentUserAdmin && currentUserId) {
        whereOptions.userId = currentUserId;
      }
      if (req.query.isReqForCancellation) {
        whereOptions.isReqForCancellation = req.query.isReqForCancellation;
      }
      if (req.query.isReqForRefund) {
        whereOptions.isReqForRefund = req.query.isReqForRefund;
      }
      if (req.query.isReqForReIssue) {
        whereOptions.isReqForReIssue = req.query.isReqForReIssue;
      }
      if (req.query.id) {
        whereOptions.id = req.query.id;
      }
      if (req.query.pnr) {
        whereOptions.pnr = req.query.pnr;
      }
      if (req.query.startDate && req.query.endDate) {
        // Both startDate and endDate provided
        whereOptions.createdAt = {
          [Op.between]: [req.query.startDate, req.query.endDate],
        };
      } else if (req.query.startDate) {
        // Only startDate provided
        whereOptions.createdAt = {
          [Op.gte]: req.query.startDate,
        };
      } else if (req.query.endDate) {
        // Only endDate provided
        whereOptions.createdAt = {
          [Op.lte]: req.query.endDate,
        };
      }
      const pnrBookings = await PnrBooking.findAll({
        where: whereOptions,
        include: [
          // ***********[Op.is]: null, not working  ******
          // {
          //   model: PnrPayment,
          //   // required: false,
          //   where: {
          //     id: {
          //       [Op.is]: null,
          //     },
          //   },
          // },
          {
            model: User,
          },
          {
            model: PnrServiceCharges,
            include: [
              {
                model: CommissionCategories,
              },
            ],
          },
          {
            model: PnrDetail,
            as: 'pnrDetail',
          },
          {
            model: FlightDetails,
            include: [
              {
                model: ExtraBaggage,
              },
              {
                model: BaggageAllowance,
              },
              {
                model: BookingFlight,
              },
              {
                model: Fare,
                include: [
                  {
                    model: PassengerInfoList,
                    include: [
                      {
                        model: PassengerInfo,
                        include: [
                          {
                            model: CurrencyConversion,
                          },
                        ],
                      },
                    ],
                  },
                  {
                    model: TotalFare,
                  },
                ],
              },
              {
                model: GroupDescription,
              },
              {
                model: SchedualDetGet,
                attributes: ['id'],
                include: [
                  {
                    model: InnerSchedualDetGet,
                    include: [
                      {
                        model: Arrival,
                      },
                      {
                        model: Departure,
                      },
                      {
                        model: Carrier,
                        include: [
                          {
                            model: Equipment,
                          },
                        ],
                      },
                    ],
                  },
                ],
              },

              {
                model: FlightSegments,
              },
            ],
          },
        ],
        limit: 100,
        order: [['createdAt', 'DESC']],
      })
        .then((rawData) => {
          const plainObjects = rawData.map((instance) => instance.toJSON());

          plainObjects.map((data) => {
            const arr = data.flightDetails.schedualDetGet;
            data.flightDetails.schedualDetGet = [];
            arr.map((data2) => {
              data.flightDetails.schedualDetGet.push(data2.innerSchedualDetGet);
            });
          });

          return plainObjects;
        })

        .catch((error) => {
          // Handle errors here
          console.error(error);
        });

      return this.responseService.createResponse(
        HttpStatus.OK,
        // newPnrBookings,
        pnrBookings,
        'GET_SUCCESS',
      );
    } catch (error) {
      console.log(error);
      return this.responseService.createResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        null,
        error.message,
      );
    }
  }

  async findAllBk(
    req,
    currentUserId: number,
    isCurrentUserAdmin: number,
  ): Promise<any> {
    try {
      // Define where conditions based on user role and query parameters
      const whereOptions: any = {};
      if (!isCurrentUserAdmin && currentUserId) {
        whereOptions.userId = currentUserId;
      }
      if (req.query.isReqForCancellation) {
        whereOptions.isReqForCancellation = req.query.isReqForCancellation;
      }
      if (req.query.isReqForRefund) {
        whereOptions.isReqForRefund = req.query.isReqForRefund;
      }
      if (req.query.isReqForReIssue) {
        whereOptions.isReqForReIssue = req.query.isReqForReIssue;
      }
      if (req.query.id) {
        whereOptions.id = req.query.id;
      }
      if (req.query.pnr) {
        whereOptions.pnr = req.query.pnr;
      }
      if (req.query.startDate && req.query.endDate) {
        whereOptions.createdAt = {
          [Op.between]: [req.query.startDate, req.query.endDate],
        };
      } else if (req.query.startDate) {
        whereOptions.createdAt = {
          [Op.gte]: req.query.startDate,
        };
      } else if (req.query.endDate) {
        whereOptions.createdAt = {
          [Op.lte]: req.query.endDate,
        };
      }

      // Pagination parameters
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 10;
      const offset = (page - 1) * pageSize;
      const limit = pageSize;

      // Fetch paginated data with associated models
      const { count, rows } = await PnrBooking.findAndCountAll({
        where: whereOptions,
        include: [
          {
            model: User,
          },
          {
            model: PnrServiceCharges,
            include: [
              {
                model: CommissionCategories,
              },
            ],
          },
          {
            model: PnrDetail,
            as: 'pnrDetail',
          },
          {
            model: FlightDetails,
            include: [
              {
                model: ExtraBaggage,
              },
              {
                model: BaggageAllowance,
              },
              {
                model: BookingFlight,
              },
              {
                model: Fare,
                include: [
                  {
                    model: PassengerInfoList,
                    include: [
                      {
                        model: PassengerInfo,
                        include: [
                          {
                            model: CurrencyConversion,
                          },
                        ],
                      },
                    ],
                  },
                  {
                    model: TotalFare,
                  },
                ],
              },
              {
                model: GroupDescription,
              },
              {
                model: SchedualDetGet,
                attributes: ['id'],
                include: [
                  {
                    model: InnerSchedualDetGet,
                    include: [
                      {
                        model: Arrival,
                      },
                      {
                        model: Departure,
                      },
                      {
                        model: Carrier,
                        include: [
                          {
                            model: Equipment,
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                model: FlightSegments,
              },
            ],
          },
        ],
        order: [['createdAt', 'DESC']],
        limit,
        offset,
      });

      // Process and transform data if necessary
      const plainObjects = rows.map((instance) => instance.toJSON());
      plainObjects.forEach((data) => {
        const arr = data.flightDetails.schedualDetGet;
        data.flightDetails.schedualDetGet = [];
        arr.forEach((data2) => {
          data.flightDetails.schedualDetGet.push(data2.innerSchedualDetGet);
        });
      });

      // Response with paginated data and metadata
      return this.responseService.createResponse(
        HttpStatus.OK,
        {
          data: plainObjects,
          meta: {
            totalRecords: count,
            totalPages: Math.ceil(count / pageSize),
            currentPage: page,
            pageSize: pageSize,
          },
        },
        'GET_SUCCESS',
      );
    } catch (error) {
      console.error(error);
      return this.responseService.createResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        null,
        error.message,
      );
    }
  }

  async findAll(
    req,
    currentUserId: number,
    isCurrentUserAdmin: number,
  ): Promise<any> {
    try {
      // Define where conditions based on user role and query parameters
      const whereOptions: any = {};
      if (!isCurrentUserAdmin && currentUserId) {
        whereOptions.userId = currentUserId;
      }
      if (req.query.isReqForCancellation) {
        whereOptions.isReqForCancellation = req.query.isReqForCancellation;
      }
      if (req.query.isReqForRefund) {
        whereOptions.isReqForRefund = req.query.isReqForRefund;
      }
      if (req.query.isReqForReIssue) {
        whereOptions.isReqForReIssue = req.query.isReqForReIssue;
      }
      if (req.query.id) {
        whereOptions.id = req.query.id;
      }
      if (req.query.pnr) {
        whereOptions.pnr = req.query.pnr;
      }
      if (req.query.startDate && req.query.endDate) {
        whereOptions.createdAt = {
          [Op.between]: [req.query.startDate, req.query.endDate],
        };
      } else if (req.query.startDate) {
        whereOptions.createdAt = {
          [Op.gte]: req.query.startDate,
        };
      } else if (req.query.endDate) {
        whereOptions.createdAt = {
          [Op.lte]: req.query.endDate,
        };
      }

      // Pagination parameters
      const page = parseInt(req.query.page) || 1;
      const pageSize = parseInt(req.query.pageSize) || 10;
      const offset = (page - 1) * pageSize;
      const limit = pageSize;

      // Fetch paginated data with minimal associations
      const { count, rows } = await PnrBooking.findAndCountAll({
        where: whereOptions,
        include: [{ model: User }, { model: PnrDetail, as: 'pnrDetail' }],
        order: [['createdAt', 'DESC']],
        limit,
        offset,
      });

      // Convert to plain objects
      const plainObjects = rows.map((instance) => instance.toJSON());
      const bookingIds = plainObjects.map((booking) => booking.id);

      // Batch load flight details for all bookings at once
      const allFlightDetails = await FlightDetails.findAll({
        where: { pnrBookingId: { [Op.in]: bookingIds } },
        include: [
          { model: ExtraBaggage },
          { model: BaggageAllowance },
          { model: BookingFlight },
          {
            model: Fare,
            include: [
              {
                model: PassengerInfoList,
                include: [
                  {
                    model: PassengerInfo,
                    include: [{ model: CurrencyConversion }],
                  },
                ],
              },
              { model: TotalFare },
            ],
          },
          { model: GroupDescription },
          {
            model: SchedualDetGet,
            attributes: ['id'],
            include: [
              {
                model: InnerSchedualDetGet,
                include: [
                  { model: Arrival },
                  { model: Departure },
                  {
                    model: Carrier,
                    include: [{ model: Equipment }],
                  },
                ],
              },
            ],
          },
          { model: FlightSegments },
        ],
      });

      // Group flight details by booking ID
      const flightDetailsByBooking = allFlightDetails.reduce((acc, detail) => {
        if (!acc[detail.pnrBookingId]) {
          acc[detail.pnrBookingId] = [];
        }
        acc[detail.pnrBookingId].push(detail);
        return acc;
      }, {});

      // Attach flight details to each booking
      plainObjects.forEach((booking) => {
        booking.flightDetails = flightDetailsByBooking[booking.id] || [];

        // Transform schedualDetGet if needed
        if (booking.flightDetails) {
          booking.flightDetails.forEach((flightDetail) => {
            if (flightDetail.schedualDetGet) {
              flightDetail.schedualDetGet = flightDetail.schedualDetGet
                .map((schedule) => schedule.innerSchedualDetGet)
                .filter(Boolean); // Remove undefined/null
            }
          });
        }
      });

      // Response with paginated data and metadata
      return this.responseService.createResponse(
        HttpStatus.OK,
        {
          data: plainObjects,
          meta: {
            totalRecords: count,
            totalPages: Math.ceil(count / pageSize),
            currentPage: page,
            pageSize: pageSize,
          },
        },
        'GET_SUCCESS',
      );
    } catch (error) {
      console.error(error);
      return this.responseService.createResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        null,
        error.message,
      );
    }
  }

  async createLeadCrm(body: any): Promise<any> {
    try {
      const { leadData, userData } = body;
      const leadIds = [];
      await Promise.all(
        userData.map(async (user) => {
          const result = await this.callLeadCreation(leadData, user);
          leadIds.push(result);
        }),
      );

      return this.responseService.createResponse(
        HttpStatus.OK,
        leadIds,
        'Success',
      );
    } catch (error) {
      console.log(error);
      return this.responseService.createResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        null,
        error.message,
      );
    }
  }
  async findAllWithPayment(
    req,
    currentUserId: number,
    isCurrentUserAdmin: number,
  ): Promise<any> {
    try {
      const isPaid = req.query.isPaid;
      // const isPaid = 1;
      const whereOptions: any = {};
      if (!isCurrentUserAdmin && currentUserId) {
        whereOptions.userId = currentUserId;
      }
      if (req.query.isReqForCancellation) {
        whereOptions.isReqForCancellation = req.query.isReqForCancellation;
      }
      if (req.query.isReqForRefund) {
        whereOptions.isReqForRefund = req.query.isReqForRefund;
      }
      if (req.query.isReqForReIssue) {
        whereOptions.isReqForReIssue = req.query.isReqForReIssue;
      }
      if (req.query.id) {
        whereOptions.id = req.query.id;
      }
      if (req.query.pnr) {
        whereOptions.pnr = req.query.pnr;
      }
      if (req.query.startDate && req.query.endDate) {
        // Both startDate and endDate provided
        whereOptions.createdAt = {
          [Op.between]: [req.query.startDate, req.query.endDate],
        };
      } else if (req.query.startDate) {
        // Only startDate provided
        whereOptions.createdAt = {
          [Op.gte]: req.query.startDate,
        };
      } else if (req.query.endDate) {
        // Only endDate provided
        whereOptions.createdAt = {
          [Op.lte]: req.query.endDate,
        };
      }
      const pnrBookings = await PnrBooking.findAll({
        where: whereOptions,
        include: [
          {
            model: User,
          },
          {
            model: PnrServiceCharges,
            include: [
              {
                model: CommissionCategories,
              },
            ],
          },
          ...(isPaid === '1'
            ? [
                {
                  model: PnrPayment,
                  required: true,
                },
              ]
            : isPaid === 0
              ? [
                  {
                    model: PnrPayment,
                    required: false,
                    where: {
                      id: null,
                    },
                  },
                ]
              : [
                  {
                    model: PnrPayment,
                  },
                ]),
          {
            model: PnrDetail,
            as: 'pnrDetail',
          },
          {
            model: FlightDetails,
            include: [
              {
                model: ExtraBaggage,
              },
              {
                model: BaggageAllowance,
              },
              {
                model: BookingFlight,
              },
              {
                model: Fare,
                include: [
                  {
                    model: PassengerInfoList,
                    include: [
                      {
                        model: PassengerInfo,
                        include: [
                          {
                            model: CurrencyConversion,
                          },
                        ],
                      },
                    ],
                  },
                  {
                    model: TotalFare,
                  },
                ],
              },
              {
                model: GroupDescription,
              },
              {
                model: SchedualDetGet,
                attributes: ['id'],
                include: [
                  {
                    model: InnerSchedualDetGet,
                    include: [
                      {
                        model: Arrival,
                      },
                      {
                        model: Departure,
                      },
                      {
                        model: Carrier,
                        include: [
                          {
                            model: Equipment,
                          },
                        ],
                      },
                    ],
                  },
                ],
              },

              {
                model: FlightSegments,
              },
            ],
          },
        ],
        order: [['createdAt', 'DESC']],
      })
        .then((rawData) => {
          const plainObjects = rawData.map((instance) => instance.toJSON());

          plainObjects.map((data) => {
            const arr = data.flightDetails.schedualDetGet;
            data.flightDetails.schedualDetGet = [];
            arr.map((data2) => {
              data.flightDetails.schedualDetGet.push(data2.innerSchedualDetGet);
            });
          });

          return plainObjects;
        })

        .catch((error) => {
          // Handle errors here
          console.error(error);
        });
      console.log('isPaid', isPaid);

      return this.responseService.createResponse(
        HttpStatus.OK,
        // newPnrBookings,
        pnrBookings,
        GET_SUCCESS,
      );
    } catch (error) {
      console.log(error);
      return this.responseService.createResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        null,
        error.message,
      );
    }
  }
  async findOne(
    id: string,
    currentUserId: number,
    isCurrentUserAdmin: number,
  ): Promise<any> {
    try {
      const whereOptions: any = {};
      if (!isCurrentUserAdmin && currentUserId) {
        whereOptions.userId = currentUserId;
      }
      const pnrBookings = await PnrBooking.findByPk(id, {
        include: [
          {
            model: User,
          },
          {
            model: PnrServiceCharges,
            include: [
              {
                model: CommissionCategories,
              },
            ],
          },
          {
            model: PnrDetail,
            as: 'pnrDetail',
          },
          {
            model: FlightDetails,
            include: [
              {
                model: ExtraBaggage,
              },
              {
                model: BaggageAllowance,
              },
              {
                model: BookingFlight,
              },
              {
                model: Fare,
                include: [
                  {
                    model: PassengerInfoList,
                    include: [
                      {
                        model: PassengerInfo,
                        include: [
                          {
                            model: CurrencyConversion,
                          },
                        ],
                      },
                    ],
                  },
                  {
                    model: TotalFare,
                  },
                ],
              },
              {
                model: GroupDescription,
              },
              {
                model: SchedualDetGet,
                attributes: ['id'],
                include: [
                  {
                    model: InnerSchedualDetGet,
                    include: [
                      {
                        model: Arrival,
                      },
                      {
                        model: Departure,
                      },
                      {
                        model: Carrier,
                        include: [
                          {
                            model: Equipment,
                          },
                        ],
                      },
                    ],
                  },
                ],
              },

              {
                model: FlightSegments,
              },
            ],
          },
        ],
      }).then((rawData) => {
        // console.log(rawData);
        const plainObject = rawData.toJSON();
        const arr = plainObject.flightDetails.schedualDetGet;
        plainObject.flightDetails.schedualDetGet = [];
        arr.map((data2) => {
          plainObject.flightDetails.schedualDetGet.push(
            data2.innerSchedualDetGet,
          );
        });

        return plainObject;
      });
      if (!pnrBookings) {
        return this.responseService.createResponse(
          HttpStatus.NOT_FOUND,
          null,
          'Record Not Found',
        );
      }
      if (!isCurrentUserAdmin && pnrBookings.userId !== currentUserId) {
        return this.responseService.createResponse(
          HttpStatus.UNAUTHORIZED,
          null,
          AUTHENTICATION_ERROR,
        );
      }
      return this.responseService.createResponse(
        HttpStatus.OK,
        pnrBookings,
        GET_SUCCESS,
      );
    } catch (error) {
      console.log(error);
      return this.responseService.createResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        null,
        error.message,
      );
    }
  }

  async findByPnr(req): Promise<any> {
    try {
      const whereOptions: any = {};
      if (req.query.pnr) {
        whereOptions.pnr = req.query.pnr;
      } else {
        return this.responseService.createResponse(
          HttpStatus.NOT_FOUND,
          null,
          'Please provide search parameter.',
        );
      }
      // Test
      let pnrBookings = await PnrBooking.findOne({
        where: whereOptions,
      });
      if (pnrBookings) {
        pnrBookings = await PnrBooking.findOne({
          where: whereOptions,

          include: [
            {
              model: User,
            },
            {
              model: PnrServiceCharges,
              include: [
                {
                  model: CommissionCategories,
                },
              ],
            },
            {
              model: PnrDetail,
              as: 'pnrDetail',
            },
            {
              model: FlightDetails,
              include: [
                {
                  model: ExtraBaggage,
                },
                {
                  model: BaggageAllowance,
                },
                {
                  model: BookingFlight,
                },
                {
                  model: Fare,
                  include: [
                    {
                      model: PassengerInfoList,
                      include: [
                        {
                          model: PassengerInfo,
                          include: [
                            {
                              model: CurrencyConversion,
                            },
                          ],
                        },
                      ],
                    },
                    {
                      model: TotalFare,
                    },
                  ],
                },
                {
                  model: GroupDescription,
                },
                {
                  model: SchedualDetGet,
                  attributes: ['id'],
                  include: [
                    {
                      model: InnerSchedualDetGet,
                      include: [
                        {
                          model: Arrival,
                        },
                        {
                          model: Departure,
                        },
                        {
                          model: Carrier,
                          include: [
                            {
                              model: Equipment,
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },

                {
                  model: FlightSegments,
                },
              ],
            },
          ],
        }).then((rawData) => {
          // console.log(rawData);
          const plainObject = rawData.toJSON();
          const arr = plainObject.flightDetails.schedualDetGet;
          plainObject.flightDetails.schedualDetGet = [];
          arr.map((data2) => {
            plainObject.flightDetails.schedualDetGet.push(
              data2.innerSchedualDetGet,
            );
          });

          return plainObject;
        });
      } else {
        return this.responseService.createResponse(
          HttpStatus.NOT_FOUND,
          null,
          'Record Not Found',
        );
      }
      if (pnrBookings) {
        return this.responseService.createResponse(
          HttpStatus.OK,
          pnrBookings,
          // { userFromSession, users },
          GET_SUCCESS,
        );
      }
    } catch (error) {
      console.log(error);
      return this.responseService.createResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        null,
        error.message,
      );
    }
  }
  async findByOrderId(req): Promise<any> {
    try {
      const whereOptions: any = {};
      if (req.query.orderId) {
        whereOptions.orderId = req.query.orderId;
      } else {
        return this.responseService.createResponse(
          HttpStatus.NOT_FOUND,
          null,
          'Please provide search parameter.',
        );
      }
      // Test
      let pnrBookings = await PnrBooking.findOne({
        where: whereOptions,
      });
      if (pnrBookings) {
        pnrBookings = await PnrBooking.findOne({
          where: whereOptions,

          include: [
            {
              model: User,
            },
            {
              model: PnrServiceCharges,
              include: [
                {
                  model: CommissionCategories,
                },
              ],
            },
            {
              model: PnrDetail,
              as: 'pnrDetail',
            },
            {
              model: FlightDetails,
              include: [
                {
                  model: ExtraBaggage,
                },
                {
                  model: BaggageAllowance,
                },
                {
                  model: BookingFlight,
                },
                {
                  model: Fare,
                  include: [
                    {
                      model: PassengerInfoList,
                      include: [
                        {
                          model: PassengerInfo,
                          include: [
                            {
                              model: CurrencyConversion,
                            },
                          ],
                        },
                      ],
                    },
                    {
                      model: TotalFare,
                    },
                  ],
                },
                {
                  model: GroupDescription,
                },
                {
                  model: SchedualDetGet,
                  attributes: ['id'],
                  include: [
                    {
                      model: InnerSchedualDetGet,
                      include: [
                        {
                          model: Arrival,
                        },
                        {
                          model: Departure,
                        },
                        {
                          model: Carrier,
                          include: [
                            {
                              model: Equipment,
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },

                {
                  model: FlightSegments,
                },
              ],
            },
          ],
        }).then((rawData) => {
          // console.log(rawData);
          const plainObject = rawData.toJSON();
          const arr = plainObject.flightDetails.schedualDetGet;
          plainObject.flightDetails.schedualDetGet = [];
          arr.map((data2) => {
            plainObject.flightDetails.schedualDetGet.push(
              data2.innerSchedualDetGet,
            );
          });

          return plainObject;
        });
      } else {
        return this.responseService.createResponse(
          HttpStatus.NOT_FOUND,
          null,
          'Record Not Found',
        );
      }
      if (pnrBookings) {
        return this.responseService.createResponse(
          HttpStatus.OK,
          pnrBookings,
          // { userFromSession, users },
          GET_SUCCESS,
        );
      }
    } catch (error) {
      console.log(error);
      return this.responseService.createResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        null,
        error.message,
      );
    }
  }
  async findBy(
    req,
    currentUserId: number,
    isCurrentUserAdmin: number,
  ): Promise<any> {
    try {
      const whereOptions: any = {};
      if (!isCurrentUserAdmin && currentUserId) {
        whereOptions.userId = currentUserId;
      }
      if (req.query.cnic) {
        whereOptions.cnic = req.query.cnic;
      } else if (req.query.passportNo) {
        whereOptions.passportNo = req.query.passportNo;
      } else if (req.query.phoneNumber) {
        whereOptions.phoneNumber = req.query.phoneNumber;
      } else if (req.query.email) {
        whereOptions.email = req.query.email;
      } else {
        return this.responseService.createResponse(
          HttpStatus.NOT_FOUND,
          null,
          'Please provide search parameter.',
        );
      }

      const pnrBookings = await PnrBooking.findOne({
        include: [
          {
            model: User,
          },
          {
            model: PnrServiceCharges,
            include: [
              {
                model: CommissionCategories,
              },
            ],
          },
          {
            model: PnrDetail,
            as: 'pnrDetail',
            where: whereOptions,
          },
        ],
      });
      if (pnrBookings) {
        return this.responseService.createResponse(
          HttpStatus.OK,
          pnrBookings,
          // { userFromSession, users },
          GET_SUCCESS,
        );
      } else {
        return this.responseService.createResponse(
          HttpStatus.NOT_FOUND,
          null,
          'Record Not Found',
        );
      }
    } catch (error) {
      console.log(error);
      return this.responseService.createResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        null,
        error.message,
      );
    }
  }
  async remove(id: number): Promise<void> {
    try {
      const pnrBooking = await this.pnrBookingRepository.findByPk(id);
      if (!pnrBooking) {
        return this.responseService.createResponse(
          HttpStatus.NOT_FOUND,
          null,
          'pnrBooking not found',
        );
      }
      await pnrBooking.destroy();
      return this.responseService.createResponse(
        HttpStatus.OK,
        null,
        'Success',
      );
    } catch (error) {
      console.log(error);
      return this.responseService.createResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        null,
        error.message,
      );
    }
  }
  async reqForCancellation(id: number): Promise<void> {
    try {
      const pnrBooking = await this.pnrBookingRepository.findByPk(id);
      if (!pnrBooking) {
        return this.responseService.createResponse(
          HttpStatus.NOT_FOUND,
          null,
          'pnrBooking not found',
        );
      }
      if (pnrBooking.isReqForRefund || pnrBooking.isReqForReIssue) {
        return this.responseService.createResponse(
          HttpStatus.INTERNAL_SERVER_ERROR,
          null,
          'Request Failed, another request in process',
        );
      }
      pnrBooking.isReqForCancellation = true;

      await pnrBooking.save();
      return this.responseService.createResponse(
        HttpStatus.OK,
        null,
        'Cancellation Request Initiated Successfully ',
      );
    } catch (error) {
      console.log(error);
      return this.responseService.createResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        null,
        error.message,
      );
    }
  }
  async reqForRefund(id: number): Promise<void> {
    try {
      const pnrBooking = await this.pnrBookingRepository.findByPk(id);
      if (!pnrBooking) {
        return this.responseService.createResponse(
          HttpStatus.NOT_FOUND,
          null,
          'pnrBooking not found',
        );
      }
      if (pnrBooking.isReqForCancellation || pnrBooking.isReqForReIssue) {
        return this.responseService.createResponse(
          HttpStatus.INTERNAL_SERVER_ERROR,
          null,
          'Request Failed, another request in process',
        );
      }
      pnrBooking.isReqForRefund = true;

      await pnrBooking.save();
      return this.responseService.createResponse(
        HttpStatus.OK,
        null,
        'Refund Request Initiated Successfully ',
      );
    } catch (error) {
      console.log(error);
      return this.responseService.createResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        null,
        error.message,
      );
    }
  }
  async reqForReIssue(id: number): Promise<void> {
    try {
      const pnrBooking = await this.pnrBookingRepository.findByPk(id);
      if (!pnrBooking) {
        return this.responseService.createResponse(
          HttpStatus.NOT_FOUND,
          null,
          'pnrBooking not found',
        );
      }
      if (pnrBooking.isReqForCancellation || pnrBooking.isReqForRefund) {
        return this.responseService.createResponse(
          HttpStatus.INTERNAL_SERVER_ERROR,
          null,
          'Request Failed, another request in process',
        );
      }
      pnrBooking.isReqForReIssue = true;

      await pnrBooking.save();
      return this.responseService.createResponse(
        HttpStatus.OK,
        null,
        'Reissue Request Initiated Successfully',
      );
    } catch (error) {
      console.log(error);
      return this.responseService.createResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        null,
        error.message,
      );
    }
  }
  async doneCancellation(id: number): Promise<void> {
    try {
      const pnrBooking = await this.pnrBookingRepository.findByPk(id);
      if (!pnrBooking) {
        return this.responseService.createResponse(
          HttpStatus.NOT_FOUND,
          null,
          'pnrBooking not found',
        );
      }
      if (pnrBooking.isReqForRefund || pnrBooking.isReqForReIssue) {
        return this.responseService.createResponse(
          HttpStatus.INTERNAL_SERVER_ERROR,
          null,
          'Request Failed, another request in process',
        );
      }
      if (!pnrBooking.isReqForCancellation) {
        return this.responseService.createResponse(
          HttpStatus.INTERNAL_SERVER_ERROR,
          null,
          'Request Failed, Not requested',
        );
      }
      pnrBooking.isCancelled = true;

      await pnrBooking.save();
      return this.responseService.createResponse(
        HttpStatus.OK,
        null,
        'Cancellation Request Initiated Successfully ',
      );
    } catch (error) {
      console.log(error);
      return this.responseService.createResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        null,
        error.message,
      );
    }
  }
  async doneRefund(id: number): Promise<void> {
    try {
      const pnrBooking = await this.pnrBookingRepository.findByPk(id);
      if (!pnrBooking) {
        return this.responseService.createResponse(
          HttpStatus.NOT_FOUND,
          null,
          'pnrBooking not found',
        );
      }
      if (pnrBooking.isReqForCancellation || pnrBooking.isReqForReIssue) {
        return this.responseService.createResponse(
          HttpStatus.INTERNAL_SERVER_ERROR,
          null,
          'Request Failed, another request in process',
        );
      }
      if (!pnrBooking.isReqForRefund) {
        return this.responseService.createResponse(
          HttpStatus.INTERNAL_SERVER_ERROR,
          null,
          'Request Failed, Not requested',
        );
      }
      pnrBooking.isRefunded = true;

      await pnrBooking.save();
      return this.responseService.createResponse(
        HttpStatus.OK,
        null,
        'Refund Request Initiated Successfully ',
      );
    } catch (error) {
      console.log(error);
      return this.responseService.createResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        null,
        error.message,
      );
    }
  }
  async doneReIssue(id: number): Promise<void> {
    try {
      const pnrBooking = await this.pnrBookingRepository.findByPk(id);
      if (!pnrBooking) {
        return this.responseService.createResponse(
          HttpStatus.NOT_FOUND,
          null,
          'pnrBooking not found',
        );
      }
      if (pnrBooking.isReqForCancellation || pnrBooking.isReqForRefund) {
        return this.responseService.createResponse(
          HttpStatus.INTERNAL_SERVER_ERROR,
          null,
          'Request Failed, another request in process',
        );
      }
      if (!pnrBooking.isReqForReIssue) {
        return this.responseService.createResponse(
          HttpStatus.INTERNAL_SERVER_ERROR,
          null,
          'Request Failed, Not requested',
        );
      }
      pnrBooking.isReIssueed = true;

      await pnrBooking.save();
      return this.responseService.createResponse(
        HttpStatus.OK,
        null,
        'Reissue Request Initiated Successfully',
      );
    } catch (error) {
      console.log(error);
      return this.responseService.createResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        null,
        error.message,
      );
    }
  }

  async processPayment(callbackData: any): Promise<any> {
    console.log('*****processPayment Endpoint Hit******');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    callbackData = callbackData.obj;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars

    const pnrBooking = await PnrBooking.findOne({
      where: {
        orderId: callbackData.order.id,
      },

      include: [
        {
          model: PnrDetail,
          as: 'pnrDetail',
        },
        {
          model: User,
        },

        {
          model: FlightDetails,
          include: [
            {
              model: GroupDescription,
            },
          ],
        },
      ],
    });
    const newLog = await Log.create({
      level: '2',
      message: `--processPayment Updated ,order ID:${callbackData?.order?.id},status:${callbackData.success}`,

      meta: `${pnrBooking.pnr}`,
      timestamp: new Date().toISOString(),
    });
    // const viewETicketUrl = `https://faremakersnode.azurewebsites.net/previewEticket?id=${pnrBooking.id}`;
    // const errorRedirectUrl = `https://faremakersnode.azurewebsites.net/bookingpayment`;
    console.log('2');
    const t: Transaction = await sequelize.transaction();
    let log = '';
    try {
      console.log('3');

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const newPnrPayment = await PnrPayment.create(
        {
          pnrBookingId: pnrBooking.id,
          id: callbackData.id,
          pending: callbackData.pending,
          amount_cents: callbackData.amount_cents,
          success: callbackData.success,
          created_at: callbackData.created_at,
          currency: callbackData.currency,
          hmac: callbackData.hmac,
        },
        { transaction: t },
      );
      console.log('4');

      if (callbackData.success == true) {
        console.log('44');

        pnrBooking.isPaid = true;
        await pnrBooking.save({ transaction: t });
        const type = await this.findAirlineType(pnrBooking.id);
        // const type = 0;
        // console.log('type', type);
        let result;
        console.log('5');
        console.log('type**************', type);

        // AirSial
        if (type == 0) {
          console.log('66');

          result = await this.callAirSialConfirmation(pnrBooking.pnr);
          // Sabre
        } else {
          // Check Admin flag for Sabre COnfirmation Api
          const generalTask = await GeneralTask.findByPk(1, {});

          if (generalTask.flag) {
            result = await this.callSabreConfirmation(
              pnrBooking.pnr,
              pnrBooking.pnrDetail,
            );
          }
        }

        console.log('result', result);

        // external api

        await this.callPostPaymentApi(
          pnrBooking.pnr,
          pnrBooking.pnrDetail[0],
          callbackData,
        );

        const message2 = `<!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Booking Confirmation - Faremakers</title>
          <style>
            body {
              font-family: Arial, sans-serif;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              border: 1px solid #ccc;
            }
            h1, h2, h3 {
              color: #333;
            }
            p {
              margin-bottom: 10px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f2f2f2;
            }
            .link {
              display: inline-block;
              margin-top: 20px;
              background-color: #007bff;
              color: #fff;
              text-decoration: none;
              padding: 10px 20px;
              border-radius: 5px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Ticket Reservation Confirmation,  ${
              !pnrBooking.sendSmsCod && !pnrBooking.sendSmsBranch
                ? `PNR: ${pnrBooking.pnr}`
                : ''
            }</h2>
            <p>Hi!  ${pnrBooking.user.phoneNumber},</p>
            <p>PNR is generated. Please check details in the following link. </p>
            <br>Your registered information for this booking are following:
            <br>Email:  ${pnrBooking.user.email} 
            <br>Contact Number:  ${pnrBooking.user.phoneNumber} 
            <br>
            <p>Your registered information for this booking:</p>
            <ul>
              <li>Email: ${pnrBooking.user?.email}</li>
              <li>Contact Number: ${pnrBooking.user.phoneNumber}</li>
            </ul>
            <div>
              <h3>Payment Details:</h3>
              <table>
                <tr>
                  <th>Method</th>
                  <td>
                  ${
                    !pnrBooking.sendSmsCod && !pnrBooking.sendSmsBranch
                      ? 'Card Payment'
                      : ''
                  }
                    ${
                      pnrBooking.sendSmsCod && !pnrBooking.sendSmsBranch
                        ? 'Cash On Delivery'
                        : ''
                    }
                    ${
                      !pnrBooking.sendSmsCod && pnrBooking.sendSmsBranch
                        ? 'Pay at Branch'
                        : ''
                    }
                    </td>
                </tr>
                <tr>
                  <th>Total Amount</th>
                  <td>${pnrBooking.totalTicketPrice.toLocaleString()}</td>
                </tr>
              </table>
            </div>
                    <p>Best regards,<br>faremakers</p>
          </div>
        </body>
        </html>
        `;
        const message = `Your booking for ${
          pnrBooking.flightDetails.groupDescription[0]?.departureLocation
        }-${
          pnrBooking.flightDetails.groupDescription[0]?.arrivalLocation
        }, Ref# ${
          pnrBooking.id
        }, priced PKR ${pnrBooking.totalTicketPrice.toLocaleString()} has been completed. Visit faremakers.com, call 03111147111 or WA at wa.link/sml7sx for further details..`;

        await this.sendSmsConfirmation(pnrBooking.user, message);
        const toAddresses = ['hashamkhancust@gmail.com'];
        if (pnrBooking.user?.email) {
          toAddresses.push(pnrBooking.user.email);
        }
        const bccAddresses = [
          'bilal.tariq@faremakers.com',
          'arman@faremakers.com',
        ];
        log = message2;
        const mailSubject = 'Booking Confirmation - Faremakers';
        const htmlBody = `${message2}`;
        const resultEmail = await this.sendEmailConfirmation(
          toAddresses,
          bccAddresses,
          mailSubject,
          htmlBody,
          pnrBooking.pnr,
        );
        if (resultEmail) {
          console.log('Email sent successfully');
        } else {
          console.error('Failed to send email');
        }
      }
      await t.commit();

      // console.log(newPnrPayment);
      console.log('payment inserted');
      return this.responseService.createResponse(HttpStatus.OK, {}, 'SUCCESS');
      // return res.redirect(HttpStatus.FOUND, viewETicketUrl);
      // res.redirect(HttpStatus.FOUND, viewETicketUrl);
      // res.redirect(viewETicketUrl);
      // return { viewETicketUrl };
    } catch (error) {
      console.log('error222:', error);

      try {
        await t.rollback();
      } catch (rollbackError) {
        console.error('Rollback error:', rollbackError.message);
      }

      // return res.redirect(errorRedirectUrl);

      // return res.redirect(errorRedirectUrl);
      const newLog = await Log.create({
        level: '2',
        message: `INTERNAL_SERVER_ERROR Caught: processPayment:  ,order ID:${callbackData?.order?.id},status:${callbackData.success}`,

        meta: `${pnrBooking.pnr}`,
        timestamp: new Date().toISOString(),
      });
      return this.responseService.createResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        log,
        error,
      );
    }
  }

  async processPaymentJazzCash(callbackData: any): Promise<any> {
    console.log('*****processPayment Endpoint Hit******');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    callbackData = callbackData;
    console.log('callback response');
    console.log(callbackData);
    console.log(callbackData.pp_ResponseCode);

    if (
      callbackData.pp_ResponseCode === '000' ||
      callbackData.pp_ResponseCode === '121'
    ) {
      const pnrBooking = await PnrBooking.findOne({
        where: {
          orderId: callbackData.ppmpf_1,
        },

        include: [
          {
            model: PnrDetail,
            as: 'pnrDetail',
          },
          {
            model: User,
          },

          {
            model: FlightDetails,
            include: [
              {
                model: GroupDescription,
              },
            ],
          },
        ],
      });
      const t: Transaction = await sequelize.transaction();
      let log = '';
      try {
        console.log('3');

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        let success = '';
        if (
          callbackData.pp_ResponseCode === '000' ||
          callbackData.pp_ResponseCode === '121'
        ) {
          success = 'Approved';
        }

        const newPnrPayment = await PnrPayment.create(
          {
            pnrBookingId: pnrBooking.id,
            id: callbackData.ppmpf_1,
            pending: 0,
            amount_cents: callbackData.pp_Amount / 100,
            success: 1,
            created_at: Date.now(),
            currency: 'PKR',
            hmac: '',
          },
          { transaction: t },
        );

        // const newPnrPayment = await PnrPayment.create(
        //   {
        //     pnrBookingId: pnrBooking.id,
        //     id: callbackData.id,
        //     pending: callbackData.pending,
        //     amount_cents: callbackData.amount_cents,
        //     success: callbackData.success,
        //     created_at: callbackData.created_at,
        //     currency: callbackData.currency,
        //     hmac: callbackData.hmac,
        //   },
        //   { transaction: t },
        // );
        console.log('4');

        if (
          callbackData.pp_ResponseCode === '000' ||
          callbackData.pp_ResponseCode === '121'
        ) {
          console.log('44');

          pnrBooking.isPaid = true;
          await pnrBooking.save({ transaction: t });
          const type = await this.findAirlineType(pnrBooking.id);
          // const type = 0;
          // console.log('type', type);
          let result;
          console.log('5');
          console.log('type**************', type);

          // AirSial
          if (type == 0) {
            console.log('66');

            result = await this.callAirSialConfirmation(pnrBooking.pnr);
            // Sabre
          } else {
            // Check Admin flag for Sabre COnfirmation Api
            const generalTask = await GeneralTask.findByPk(1, {});

            if (generalTask.flag) {
              result = await this.callSabreConfirmation(
                pnrBooking.pnr,
                pnrBooking.pnrDetail,
              );
            }
          }

          console.log('result', result);

          // external api

          await this.callPostPaymentApiJazz(
            pnrBooking.pnr,
            pnrBooking.pnrDetail[0],
            callbackData,
          );

          const message2 = `<!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Booking Confirmation - Faremakers</title>
            <style>
              body {
                font-family: Arial, sans-serif;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                border: 1px solid #ccc;
              }
              h1, h2, h3 {
                color: #333;
              }
              p {
                margin-bottom: 10px;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20px;
              }
              th, td {
                border: 1px solid #ddd;
                padding: 8px;
                text-align: left;
              }
              th {
                background-color: #f2f2f2;
              }
              .link {
                display: inline-block;
                margin-top: 20px;
                background-color: #007bff;
                color: #fff;
                text-decoration: none;
                padding: 10px 20px;
                border-radius: 5px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h2>Ticket Reservation Confirmation,  ${
                !pnrBooking.sendSmsCod && !pnrBooking.sendSmsBranch
                  ? `PNR: ${pnrBooking.pnr}`
                  : ''
              }</h2>
              <p>Hi!  ${pnrBooking.user.phoneNumber},</p>
              <p>PNR is generated. Please check details in the following link. </p>
              <br>Your registered information for this booking are following:
              <br>Email:  ${pnrBooking.user.email} 
              <br>Contact Number:  ${pnrBooking.user.phoneNumber} 
              <br>
              <p>Your registered information for this booking:</p>
              <ul>
                <li>Email: ${pnrBooking.user?.email}</li>
                <li>Contact Number: ${pnrBooking.user.phoneNumber}</li>
              </ul>
              <div>
                <h3>Payment Details:</h3>
                <table>
                  <tr>
                    <th>Method</th>
                    <td>
                    ${
                      !pnrBooking.sendSmsCod && !pnrBooking.sendSmsBranch
                        ? 'Card Payment'
                        : ''
                    }
                      ${
                        pnrBooking.sendSmsCod && !pnrBooking.sendSmsBranch
                          ? 'Cash On Delivery'
                          : ''
                      }
                      ${
                        !pnrBooking.sendSmsCod && pnrBooking.sendSmsBranch
                          ? 'Pay at Branch'
                          : ''
                      }
                      </td>
                  </tr>
                  <tr>
                    <th>Total Amount</th>
                    <td>${pnrBooking.totalTicketPrice.toLocaleString()}</td>
                  </tr>
                </table>
              </div>
                      <p>Best regards,<br>faremakers</p>
            </div>
          </body>
          </html>
          `;
          const message = `Your booking for ${
            pnrBooking.flightDetails.groupDescription[0]?.departureLocation
          }-${
            pnrBooking.flightDetails.groupDescription[0]?.arrivalLocation
          }, Ref# ${
            pnrBooking.id
          }, priced PKR ${pnrBooking.totalTicketPrice.toLocaleString()} has been completed. Visit faremakers.com, call 03111147111 or WA at wa.link/sml7sx for further details..`;

          await this.sendSmsConfirmation(pnrBooking.user, message);
          const toAddresses = ['arman@faremakers.com'];
          if (pnrBooking.user?.email) {
            toAddresses.push(pnrBooking.user.email);
          }
          const bccAddresses = ['bilal.tariq@faremakers.com'];
          log = message2;
          const mailSubject = 'Booking Confirmation - Faremakers';
          const htmlBody = `${message2}`;
          const resultEmail = await this.sendEmailConfirmation(
            toAddresses,
            bccAddresses,
            mailSubject,
            htmlBody,
            pnrBooking.pnr,
          );
          if (resultEmail) {
            console.log('Email sent successfully');
          } else {
            console.error('Failed to send email');
          }
        }
        await t.commit();

        // console.log(newPnrPayment);
        console.log('payment inserted');
        return this.responseService.createResponse(
          HttpStatus.OK,
          {},
          'SUCCESS',
        );
        // return res.redirect(HttpStatus.FOUND, viewETicketUrl);
        // res.redirect(HttpStatus.FOUND, viewETicketUrl);
        // res.redirect(viewETicketUrl);
        // return { viewETicketUrl };
      } catch (error) {
        console.log('error222:', error);

        try {
          await t.rollback();
        } catch (rollbackError) {
          console.error('Rollback error:', rollbackError.message);
        }

        // return res.redirect(errorRedirectUrl);

        // return res.redirect(errorRedirectUrl);
        const newLog = await Log.create({
          level: '2',
          message: `INTERNAL_SERVER_ERROR Caught: processPayment:  ,order ID:${callbackData?.order?.id},status:${callbackData.success}`,

          meta: `${pnrBooking.pnr}`,
          timestamp: new Date().toISOString(),
        });
        return this.responseService.createResponse(
          HttpStatus.INTERNAL_SERVER_ERROR,
          log,
          error,
        );
      }
    } else {
    }
  }

  getCurrentDateTime(): string {
    return momenttimezone()
      .tz('Asia/Karachi')
      .format('YYYY-MM-DD HH:mm:ss.SSSZZ');
  }

  async findAirlineType(id): Promise<any> {
    const pnrBooking = await PnrBooking.findByPk(id, {
      include: [
        {
          model: FlightDetails,
          include: [
            {
              model: SchedualDetGet,
              attributes: ['id'],
              include: [
                {
                  model: InnerSchedualDetGet,
                  include: [
                    {
                      model: Arrival,
                    },
                    {
                      model: Departure,
                    },
                    {
                      model: Carrier,
                      include: [
                        {
                          model: Equipment,
                        },
                      ],
                    },
                  ],
                },
              ],
            },

            {
              model: FlightSegments,
            },
          ],
        },
      ],
    }).then((rawData) => {
      // console.log('444', rawData);

      // console.log(rawData);
      const plainObject = rawData.toJSON();
      const arr = plainObject.flightDetails.schedualDetGet;
      plainObject.flightDetails.schedualDetGet = [];
      arr.map((data2) => {
        console.log('------------', data2);
        plainObject.flightDetails.schedualDetGet.push(
          data2.innerSchedualDetGet,
        );
      });
      console.log('4444 plainObject', plainObject);

      return plainObject;
    });
    // Airsial;
    console.log(
      '**************',
      pnrBooking.flightDetails?.schedualDetGet?.[0]?.[0]?.carrier?.operating,
    );
    if (
      pnrBooking.flightDetails?.schedualDetGet?.[0]?.[0]?.carrier?.operating ===
      'PF'
    ) {
      return 0;
    } else {
      return 1;
    }
  }
  async callPostPaymentApi(pnr, pnrDetail, data): Promise<any> {
    const headers = {
      'Content-Type': 'application/json',
      // Authorization: `Bearer ${tokenSabre}`,
    };
    const url = `https://fmcrm.azurewebsites.net/Handlers/FMConnectApis.ashx?type=90&phone=0${pnrDetail.phoneNumber}&pnr=${pnr}&paymentMethod=Pay-Mob&TotalAmount=${data.amount_cents}&ContactPersonName=${pnrDetail.firstName} ${pnrDetail.lastName}&IsPaid=${data.success}`;

    const response = await this.httpService.get(url, { headers }).toPromise();
    const result = response.data;

    console.log(result);
    return result;
  }

  async callPostPaymentApiJazz(pnr, pnrDetail, data): Promise<any> {
    const headers = {
      'Content-Type': 'application/json',
      // Authorization: `Bearer ${tokenSabre}`,
    };

    let invoiceAmount = data.pp_Amount / 100; // Convert amount to main currency unit
    let comissionPerc = 2.32; // Default commission percentage
    try {
      // Use the appropriate commission based on transaction type
      if (data.pp_TxnType === 'MWALLET') {
        comissionPerc = parseFloat(process.env.COMMISSION_MWALLET);
      } else {
        comissionPerc = parseFloat(process.env.COMMISSION_OTC);
      }
    } catch (error) {}

    invoiceAmount = invoiceAmount * (1 - comissionPerc / 100);

    const url = `https://fmcrm.azurewebsites.net/Handlers/FMConnectApis.ashx?type=90&phone=0${pnrDetail.phoneNumber}&pnr=${pnr}&paymentMethod=JazzCash&TotalAmount=${invoiceAmount}&ContactPersonName=${pnrDetail.firstName} ${pnrDetail.lastName}&IsPaid=true`;

    const response = await this.httpService.get(url, { headers }).toPromise();
    const result = response.data;

    console.log(result);
    return result;
  }

  async callAirSialConfirmation(pnr): Promise<any> {
    console.log('pnr', pnr);
  }

  private async sendSmsConfirmation(
    userData: any,
    message: string,
  ): Promise<AxiosResponse> {
    // Implement your OTP sending logic here
    // Use Axios or any other HTTP client library to make the API request
    // Make sure to replace the following placeholders with your actual API details
    const payload = {
      messages: [
        {
          from: 'Faremaker',
          destinations: [
            { to: `${userData.countryCode}${userData.phoneNumber}` },
          ],
          text: message,
          // text: `Hello </br> HI`,
        },
      ],
    };
    const url =
      process.env.INFOBIP_URL ||
      'https://qgm2rw.api.infobip.com/sms/2/text/advanced';
    const headers = {
      headers: {
        Authorization: `App ${
          process.env.INFOBIP_KEY ||
          'ac1a6fbed96a4d5f8dc7f16f97d5ba93-c292b377-20a3-4a8c-9c65-ff43faaa315f'
        }`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    };
    const response = await this.httpService
      .post(url, payload, headers)
      .toPromise();
    return response;
  }

  private async sendEmailConfirmation(
    toAddresses: string[],
    bccAddresses: string[],
    mailSubject: string,
    htmlBody: string,
    pnr: string,
  ): Promise<boolean> {
    try {
      const mg = mailgun({
        apiKey: process.env.MAILGUN_API,
        domain: process.env.MAILGUN_DOMAIN,
      });
      const data = {
        from: process.env.MAILGUN_FROM,
        to: toAddresses.join(','),
        subject: mailSubject,
        html: htmlBody,
      };

      if (bccAddresses && bccAddresses.length > 0) {
        data['bcc'] = bccAddresses.join(',');
      }

      await mg.messages().send(data);
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      await Log.create({
        level: '6',
        message: `Error sending email:sendEmailConfirmation: ${mailSubject}: ${new Date().toISOString()},- ${error.message}`,
        meta: `${pnr}`,
        timestamp: new Date().toISOString(),
      });
      return false;
    }
  }
  async getAuthTokenSabre() {
    if (
      this.tokenSabre &&
      this.tokenExpirationSabre &&
      this.tokenExpirationSabre > new Date()
    ) {
      return this.tokenSabre;
    }
    const headers = {
      Authorization: `Basic ${this.keySabre}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    const url =
      process.env.AUTH_TOKEN_SABRE_ENDPOINT ||
      'https://api.havail.sabre.com/v2/auth/token';
    const data = qs.stringify({
      grant_type: 'client_credentials',
    });

    try {
      console.log('Getting New tokenSabre');
      const response = await this.httpService
        .post(url, data, { headers })
        .toPromise();
      this.tokenSabre = response.data.access_token;
      this.tokenExpirationSabre = new Date(
        new Date().getTime() + response.data.expires_in * 1000,
      );
      return this.tokenSabre;
    } catch (error) {
      console.log('tokenSabre Error');
      throw new Error(`Error getting auth tokenSabre: ${error.message}`);
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async callSabreConfirmation(pnr, passengers: any): Promise<any> {
    const token = await this.getAuthTokenSabre();
    console.log('token', token);
    const snosArray = passengers.map(
      (item, index) => `{ "Number": ${index + 1} }`,
    );
    const snos = snosArray.join(',');

    const requestOptions = {
      method: 'POST',
      url: 'https://api.havail.sabre.com/v1.3.0/air/ticket',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: {
        AirTicketRQ: {
          version: '1.3.0',
          targetCity: '43ED',
          DesignatePrinter: {
            Printers: {
              Hardcopy: { LNIATA: 'B19DC5' },
              Ticket: { CountryCode: 'PK' },
            },
          },
          Itinerary: { ID: pnr },
          Ticketing: [
            { PricingQualifiers: { PriceQuote: [{ Record: snos }] } },
          ],
          PostProcessing: {
            EndTransaction: { Source: { ReceivedFrom: 'FM WEB1' } },
          },
        },
      },
      json: true,
    };
    const response: any = await this.httpService
      .post(requestOptions.url, requestOptions.body, {
        headers: requestOptions.headers,
      })
      .toPromise();

    // Update passengers' ticket numbers
    for (const doc of response.AirTicketRS.Summary) {
      for (const passenger of passengers) {
        if (
          passenger.FirstName.trim().toLowerCase() ===
            doc.FirstName.trim().toLowerCase() &&
          passenger.LastName.trim().toLowerCase() ===
            doc.LastName.trim().toLowerCase()
        ) {
          const passengerEntity = await PnrDetail.findOne({
            where: { id: passenger.id },
          });
          if (passengerEntity) {
            passengerEntity.ticketNo = doc.DocumentNumber;
            passengerEntity.ticketLocalIssueDateTime = doc.LocalIssueDateTime;
            await passengerEntity.save();
          }
        }
      }
    }
    // console.log('response', response);
    return true;
  }
}
