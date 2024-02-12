import { Injectable, Inject, HttpStatus } from '@nestjs/common';
import { PnrBookingDto } from './dto/create-pnrBooking.dto';
// import { PnrBookingArrayDto } from './dto/PnrBookingArray.dto';
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
import { sequelize, Transaction } from '../../../database/sequelize.provider'; // Adjust the path accordingly
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
import { CommissionPercentage } from '../../serviceCharges/commissionPercentage';
import { Destination } from '../../serviceCharges/destination';
import { Sector } from '../../serviceCharges/sector';
import { FareClass } from '../../serviceCharges/fareClass';
import { Airline } from '../../serviceCharges/airline';
import { CommissionCategories } from '../../serviceCharges/commissionCategories';
import { PnrPayment } from '../../paymentModules/paymob/entities/pnrPayment.entity';

@Injectable()
export class PnrBookingsService {
  constructor(
    @Inject(PNR_BOOKINGS_REPOSITORY)
    private pnrBookingRepository: typeof PnrBooking,
    private readonly responseService: ResponseService,
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
      const { pnrBookings, pnr, phoneNumber, countryCode, flightDetails } =
        pnrBookingDto;
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
      console.log('currentUserId', currentUserId);
      const newPnrBookingRepository = await this.pnrBookingRepository.create(
        {
          userId: currentUserId,
          pnr: pnr,
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
        const pnrServiceChargesCode = 'unknownCode';
        switch (commissionCategory.id) {
          case 1:
            const airline = await Airline.findOne({
              where: { code: pnrServiceChargesCode },
            });

            if (airline) {
              const commissionPercentage = await CommissionPercentage.findOne({
                where: { airlineId: airline.id },
              });

              if (commissionPercentage) {
                pnrServiceChargesPercentage = commissionPercentage.percentage;
              }
            }
            break;

          case 2:
            const fareClass = await FareClass.findOne({
              where: { code: pnrServiceChargesCode },
            });

            if (fareClass) {
              const commissionPercentage = await CommissionPercentage.findOne({
                where: { fareClassId: fareClass.id },
              });

              if (commissionPercentage) {
                pnrServiceChargesPercentage = commissionPercentage.percentage;
              }
            }
            break;
          case 3:
            const sector = await Sector.findOne({
              where: { code: pnrServiceChargesCode },
            });

            if (sector) {
              const commissionPercentage = await CommissionPercentage.findOne({
                where: { sectorId: sector.id },
              });

              if (commissionPercentage) {
                pnrServiceChargesPercentage = commissionPercentage.percentage;
              }
            }
            break;

          case 4:
            const destination = await Destination.findOne({
              where: { code: pnrServiceChargesCode },
            });

            if (destination) {
              const commissionPercentage = await CommissionPercentage.findOne({
                where: { destinationId: destination.id },
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

  // test comit issue
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
          {
            model: User,
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

      const pnrBookings = await PnrBooking.findOne({
        where: whereOptions,

        include: [
          {
            model: User,
          },
          {
            model: PnrDetail,
            as: 'pnrDetail',
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
        'Reissue Request Initiated Successfully ',
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
  async processPayment(callbackData: any, req, res): Promise<any> {
    const pnrBooking = await this.pnrBookingRepository.findOne({
      where: {
        // pnr: callbackData.pnr,
        // pnr: '1BXGMB',
      },
      order: [['createdAt', 'DESC']],
    });
    console.log('req.query *********** ', req.query);
    const viewETicketUrl = `http://localhost:3000/previewEticket?id=${pnrBooking.id}`;
    const errorRedirectUrl = `http://localhost:3000/bookingpayment`;

    const t: Transaction = await sequelize.transaction();

    try {
      callbackData = req.query;
      console.log('callbackData *********** ', callbackData);

      const newPnrPayment = await PnrPayment.create(
        {
          pnrBookingId: pnrBooking.id,
          id: callbackData.id,
          pending: callbackData.pending,
          amount_cents: callbackData.amount_cents,
          success: callbackData.success,
          is_auth: callbackData.is_auth,
          is_capture: callbackData.is_capture,
          is_standalone_payment: callbackData.is_standalone_payment,
          is_voided: callbackData.is_voided,
          is_refunded: callbackData.is_refunded,
          is_3d_secure: callbackData.is_3d_secure,
          integration_id: callbackData.integration_id,
          profile_id: callbackData.profile_id,
          has_parent_transaction: callbackData.has_parent_transaction,
          order: callbackData.order,
          created_at: callbackData.created_at,
          currency: callbackData.currency,
          merchant_commission: callbackData.merchant_commission,
          // discount_details: callbackData.discount_details,
          is_void: callbackData.is_void,
          is_refund: callbackData.is_refund,
          error_occurred: callbackData.error_occurred,
          refunded_amount_cents: callbackData.refunded_amount_cents,
          captured_amount: callbackData.captured_amount,
          updated_at: callbackData.updated_at,
          is_settled: callbackData.is_settled,
          bill_balanced: callbackData.bill_balanced,
          is_bill: callbackData.is_bill,
          owner: callbackData.owner,
          data_message: callbackData.data?.message || '',
          source_data_type: callbackData.source_data?.type,
          source_data_pan: callbackData.source_data?.pan,
          source_data_sub_type: callbackData.source_data?.sub_type,
          acq_response_code: callbackData.acq_response_code,
          txn_response_code: callbackData.txn_response_code,
          hmac: callbackData.hmac,
        },
        { transaction: t },
      );
      await t.commit();

      console.log(newPnrPayment);
      console.log('payment inserted');
      return res.redirect(HttpStatus.FOUND, viewETicketUrl);
      // res.redirect(HttpStatus.FOUND, viewETicketUrl);
      // res.redirect(viewETicketUrl);
      return { viewETicketUrl };
    } catch (error) {
      console.log('error:', error);

      await t.rollback();

      return res.redirect(errorRedirectUrl);
      // return res.redirect(errorRedirectUrl);

      console.log('error:', error);
      return this.responseService.createResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        null,
        error,
      );
    }
  }
}
