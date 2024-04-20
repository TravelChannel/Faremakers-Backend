import { Injectable, Inject, HttpStatus } from '@nestjs/common';
import { PnrBookingDto } from './dto/create-pnrBooking.dto';
import { AxiosResponse } from 'axios';
import * as mailgun from 'mailgun-js';

// import { PnrBookingArrayDto } from './dto/PnrBookingArray.dto';
import * as qs from 'qs';

// import { UpdateVoucherDto } from './dto/update-vouchers.dto';

import {
  SAVED_SUCCESS,
  GET_SUCCESS,
  AUTHENTICATION_ERROR,
} from '../../../shared/messages.constants';
import { PNR_BOOKINGS_REPOSITORY } from '../../../shared/constants';
import { PnrBooking } from './entities/pnrBooking.entity';
import { PnrDetail } from '../pnrDetails';
import { User } from '../..//generalModules/users/entities/user.entity';
import {
  // Op,
  sequelize,
  Transaction,
} from '../../../database/sequelize.provider'; // Adjust the path accordingly
import { ResponseService } from '../../../common/utility/response/response.service';
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
import { InnerSchedualDetGet } from '../innerSchedualDetGet';
import { TotalFare } from '../totalFare';
import { Carrier } from '../carrier';
import { Departure } from '../departure';
import { Arrival } from '../arrival';
import { Equipment } from '../equipment';
import { PnrServiceCharges } from '../../serviceCharges/pnrServiceCharges';
import { CommissionPercentage } from '../../serviceCharges/commissionPercentage/entities/commissionPercentage.entity';
import { Sector } from '../../serviceCharges/sector';
import { FareClass } from '../../serviceCharges/fareClass';
import { Airline } from '../../serviceCharges/airline';
import { Promotion } from '../../generalModules/promotions/entities/promotion.entity';
import { CommissionCategories } from '../../serviceCharges/commissionCategories';
import { PnrPayment } from '../../paymentModules/paymob/entities/pnrPayment.entity';
import { HttpService } from '@nestjs/axios';
import { GeneralTask } from '../../generalModules/generalTasks/entities/generalTask.entity';

@Injectable()
export class PnrBookingsService {
  private tokenSabre: string | null = null;
  private tokenExpirationSabre: Date | null = null;
  private keySabre = 'VmpFNk5UVTFOVG8wTTBWRU9rRkI6YzNOM2NtVnpPVGs9';
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
    console.log('currentUserId', currentUserId);
    const t: Transaction = await sequelize.transaction();
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const {
        pnrBookings,
        pnr,
        OrderId,
        // phoneNumber,
        // countryCode,
        flightDetails,
        MajorInfo,
        leadCreationData,
      } = pnrBookingDto;
      // let newUser = await User.findOne({
      //   where: {
      //     phoneNumber: phoneNumber,
      //     countryCode,
      //   },
      // });
      // if (!newUser) {
      //   newUser = await User.create(
      //     {
      //       phoneNumber: phoneNumber,
      //       countryCode,
      //     },
      //     { transaction: t },
      //   );
      // }
      const newPnrBookingRepository = await this.pnrBookingRepository.create(
        {
          userId: currentUserId,
          pnr: pnr,
          orderId: OrderId,
        },
        { transaction: t },
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars

      if (pnrBookings.length > 0) {
        await Promise.all(
          pnrBookings.map(async (pnrBooking) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const newPnrDetails = await PnrDetail.create(
              {
                pnrBookingId: newPnrBookingRepository.id,
                phoneNumber: pnrBooking.phoneNumber,
                email: pnrBooking.email,
                dateOfBirth: pnrBooking.dateOfBirth,
                passportExpiryDate: pnrBooking.passportExpiryDate,
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
      }
      const commissionCategory = await CommissionCategories.findOne({
        order: [['precedence', 'ASC']],
      });

      if (commissionCategory) {
        let pnrServiceChargesPercentage = 0;

        const commissionPercentage = await CommissionPercentage.findOne({
          where: {
            airlineId: null,
            fareClassId: null,
            sectorId: null,
          },
        });
        if (commissionPercentage) {
          pnrServiceChargesPercentage = commissionPercentage.percentage;
        }
        let pnrServiceChargesCode = 'unknownCode';
        // let a = 1;

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
            break;

          default:
            pnrServiceChargesPercentage = 0;
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

      await t.commit();
      return this.responseService.createResponse(
        HttpStatus.OK,
        newPnrBookingRepository,
        SAVED_SUCCESS,
      );
    } catch (error) {
      console.log('Error', error);
      await t.rollback();
      return this.responseService.createResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        null,
        error.message,
      );
    }
  }

  async callLeadCreation(leadCreationData, data): Promise<any> {
    const headers = {
      'Content-Type': 'application/json',
      // Authorization: `Bearer ${tokenSabre}`,
    };
    const url = `https://fmcrm.azurewebsites.net/Handlers/FMConnectApis.ashx?type=89&from=${leadCreationData.depart}
    &to=${leadCreationData.arrival}&name=
    ${data.firstName} ${data.lastName}&phone=${leadCreationData.phoneNumber}&email=${data.email}&adult=
    ${leadCreationData.adults}&child=${leadCreationData.children}&infant=${leadCreationData.infants}
    &airline=${leadCreationData.airline}&classtype=${leadCreationData.classType}&TripTypeId=1&depDate=
    ${leadCreationData.departDate}&retDate=${leadCreationData.returnDate}`;

    const response = await this.httpService.get(url, { headers }).toPromise();
    const result = response.data;
    console.log(result);
    return result;
  }
  async findAll(
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
  async testConfirm(): Promise<any> {
    try {
      const message = `Hello Hashim,\nYour ticket reservation is confirmed!\nThank you for choosing Faremakers.\nIf you have any questions or need assistance, feel free to reach out.\nWe look forward to hosting you! Best regards,\n  Faremakers`;
      const message2 = `First line\nSecond line\nThird line`;
      const resultSms = await this.sendSmsConfirmation(
        { phoneNumber: '3401523467', countryCode: 92 },
        message,
      );
      if (resultSms) {
        console.log('SMS sent successfully');
      } else {
        console.error('Failed to send SMS');
      }
      const toAddresses = [
        'hashamkhancust@gmail.com',
        // 'recipient2@example.com',
      ];
      const bccAddresses = ['hashimalone1@gmail.com'];
      const mailSubject = 'Ticket Confirmation';
      const htmlBody = `<p> ${message} </p>`;
      const resultEmail = await this.sendEmailConfirmation(
        toAddresses,
        bccAddresses,
        mailSubject,
        htmlBody,
      );
      if (resultEmail) {
        console.log('Email sent successfully', resultEmail);
      } else {
        console.error('Failed to send email');
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
    const newPromotion = await Promotion.create({
      title: `processPayment Updated ,order ID:${callbackData?.order?.id},status:${callbackData.success}`,
      description: new Date().toISOString(),
      startDate: null,
      endDate: null,
    });
    const pnrBooking = await this.pnrBookingRepository.findOne({
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
      ],
      // order: [['createdAt', 'DESC']],
    });

    // const viewETicketUrl = `https://faremakersnode.azurewebsites.net/previewEticket?id=${pnrBooking.id}`;
    // const errorRedirectUrl = `https://faremakersnode.azurewebsites.net/bookingpayment`;

    const t: Transaction = await sequelize.transaction();

    try {
      console.log('callbackData *********** ', pnrBooking.id, callbackData);

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

      if (callbackData.success == true) {
        pnrBooking.isPaid = true;
        await pnrBooking.save({ transaction: t });
        const type = await this.findAirlineType(pnrBooking.id);
        let result;
        if (type == 0) {
          result = this.callAirSialConfirmation(pnrBooking.pnr);
        } else {
          const generalTask = await GeneralTask.findByPk(1, {});

          if (generalTask.flag) {
            result = this.callSabreConfirmation(
              pnrBooking.pnr,
              pnrBooking.pnrDetail,
            );
          }
        }
        console.log('result', result);
        // external api

        // await this.callPostPaymentApi(
        //   pnrBooking.pnr,
        //   pnrBooking.pnrDetail[0],
        //   callbackData,
        // );
        const message = `Hello ${
          pnrBooking.user.firstName && pnrBooking.user.firstName
        } ${pnrBooking.user.lastName && pnrBooking.user.lastName} ${
          !pnrBooking.user.firstName &&
          !pnrBooking.user.lastName &&
          pnrBooking.user.countryCode + pnrBooking.user.phoneNumber
        },
        Your ticket reservation is confirmed! 🎟️ Thank you for choosing Faremakers. 
         If you have any questions or need assistance, feel free to reach out. We look forward to hosting you!
        
        Best regards,
        Faremakers`;
        await this.sendSmsConfirmation(pnrBooking.user, message);
        const toAddresses = [
          'hashamkhancust@gmail.com',
          // 'recipient2@example.com',
        ];
        const bccAddresses = ['hashimalone1@gmail.com'];
        const mailSubject = 'Ticket Confirmation';
        const htmlBody = `<p> ${message} </p>`;
        const resultEmail = await this.sendEmailConfirmation(
          toAddresses,
          bccAddresses,
          mailSubject,
          htmlBody,
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
      return 1;
      // return res.redirect(HttpStatus.FOUND, viewETicketUrl);
      // res.redirect(HttpStatus.FOUND, viewETicketUrl);
      // res.redirect(viewETicketUrl);
      // return { viewETicketUrl };
    } catch (error) {
      console.log('error:', error);

      await t.rollback();

      // return res.redirect(errorRedirectUrl);
      return 0;
      // return res.redirect(errorRedirectUrl);

      console.log('error:', error);

      return this.responseService.createResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        null,
        error,
      );
    }
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
    // Airsial;
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
    const url = `https://fmcrm.azurewebsites.net/Handlers/FMConnectApis.ashx?type=90&phone=${pnrDetail.phoneNumber}&pnr=${pnr}
    &paymentMethod=Pay-Mob&TotalAmount=${data.amount_cents}&ContactPersonName=${pnrDetail.firstName} ${pnrDetail.lastName}&IsPaid=${data.success}`;

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
          text: `${message}`,
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

    const url = 'https://api.havail.sabre.com/v2/auth/token';
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
    console.log('response', response);
    return true;
  }
}
