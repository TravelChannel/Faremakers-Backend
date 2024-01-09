import { Injectable, Inject, HttpStatus } from '@nestjs/common';
import { PnrBookingDto } from './dto/create-pnrBooking.dto';
// import { PnrBookingArrayDto } from './dto/PnrBookingArray.dto';
// import { UpdateVoucherDto } from './dto/update-vouchers.dto';
import { SAVED_SUCCESS, GET_SUCCESS } from '../../../shared/messages.constants';
import { PNR_BOOKINGS_REPOSITORY } from '../../../shared/constants';
import { PnrBooking } from './entities/pnrBooking.entity';
import { PnrDetail } from '../pnrDetails';
import { PnrUser } from '../pnrUsers';
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
import { SeatsAvailables } from '../seatsAvailables';
import { SchedualDetGet } from '../schedualDetGet';
import { InnerSchedualDetGet } from '../innerSchedualDetGet';
import { TotalFare } from '../totalFare';
import { Carrier } from '../carrier';
import { Departure } from '../departure';
import { Arrival } from '../arrival';
import { Equipment } from '../equipment';

@Injectable()
export class PnrBookingsService {
  constructor(
    @Inject(PNR_BOOKINGS_REPOSITORY)
    private pnrBookingRepository: typeof PnrBooking,
    private readonly responseService: ResponseService,
  ) {}
  async create(pnrBookingDto: PnrBookingDto): Promise<any> {
    const t: Transaction = await sequelize.transaction();
    try {
      const { pnrBookings, pnr, phoneNumber, flightDetails } = pnrBookingDto;
      let pnrUser = await PnrUser.findOne({
        where: {
          phoneNumber: phoneNumber,
        },
      });
      if (!pnrUser) {
        pnrUser = await PnrUser.create(
          {
            phoneNumber: phoneNumber,
          },
          { transaction: t },
        );
      }

      const newPnrBookingRepository = await this.pnrBookingRepository.create(
        {
          pnrUserId: pnrUser.id,
          pnr: pnr,
        },
        { transaction: t },
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      console.log('****************5');

      if (pnrBookings.length > 0) {
        await Promise.all(
          pnrBookings.map(async (pnrBooking) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const newPnrDetails = await PnrDetail.create(
              {
                pnrBookingId: newPnrBookingRepository.id,
                phoneNumber: pnrBooking.phoneNumber,
                userEmail: pnrBooking.userEmail,
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
      console.log('****************3');

      if (flightDetails) {
        const newflightDetails = await FlightDetails.create(
          {
            pnrBookingId: newPnrBookingRepository.id,
            adults: flightDetails.adults,
            children: flightDetails.children,
            infants: flightDetails.infants,
            classtype: flightDetails.classtype,
            pricingSubsource: flightDetails.pricingSubsource,
          },
          { transaction: t },
        );
        console.log('****************1');
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
        console.log('****************2');

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
        console.log('****************33333');

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
        console.log('****************444');

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
        console.log('****************5555');

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
        console.log('****************666');

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
              console.log('**********', newSchedualDetGet.id);
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

      await t.commit();
      return this.responseService.createResponse(
        HttpStatus.OK,
        newPnrBookingRepository,
        SAVED_SUCCESS,
      );
    } catch (error) {
      console.log('Error', error.message);
      await t.rollback();
      return this.responseService.createResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        null,
        error.message,
      );
    }
  }
  async findAll(): Promise<any> {
    try {
      const pnrBookings = await PnrBooking.findAll({
        include: [
          {
            model: PnrUser,
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
                model: SeatsAvailables,
              },
              {
                model: FlightSegments,
              },
            ],
          },
        ],
      })
        .then((rawData) => {
          console.log('((((((((((((', rawData);
          // Transform the result into the desired array inside array format
          const transformedResult = (rawData as any[]).map((a) =>
            (a.flightDetails as any[]).map((flightDetail) =>
              (flightDetail.SchedualDetGets as any[]).map((schedualDetGet) =>
                (schedualDetGet.InnerSchedualDetGets as any[]).map(
                  (innerSchedualDetGet) => innerSchedualDetGet.toJSON(),
                ),
              ),
            ),
          );

          // Your custom function to modify the raw data
          const modifiedResult = transformedResult.map((data) => {
            // Apply your modifications here
            // For example, you can flatten the array or perform other transformations
            // ...

            return data; // Return the modified data
          });

          return modifiedResult;
        })
        .then((modifiedResult) => {
          // Use the modified result in your application logic
          console.log(modifiedResult);
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
  async findOne(id: string): Promise<any> {
    try {
      const pnrBookings = await PnrBooking.findByPk(id, {
        include: [
          {
            model: PnrUser,
          },
          {
            model: PnrDetail,
            as: 'pnrDetail',
          },
        ],
      });
      if (!pnrBookings) {
        return this.responseService.createResponse(
          HttpStatus.NOT_FOUND,
          null,
          'Record Not Found',
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
            model: PnrUser,
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
  async findBy(req): Promise<any> {
    try {
      console.log('req', req.query);
      const whereOptions: any = {};
      if (req.query.cnic) {
        whereOptions.cnic = req.query.cnic;
      } else if (req.query.passportNo) {
        whereOptions.passportNo = req.query.passportNo;
      } else if (req.query.phoneNumber) {
        whereOptions.phoneNumber = req.query.phoneNumber;
      } else if (req.query.userEmail) {
        whereOptions.userEmail = req.query.userEmail;
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
            model: PnrUser,
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
}
