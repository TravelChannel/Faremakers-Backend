import { HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { create } from 'xmlbuilder2';
import { SoapHeaderUtil } from 'src/common/utility/amadeus/soap-header.util';
import { MasterPriceTravelBoardUtil } from 'src/common/utility/amadeus/mp-travelboard.util';
const crypto = require('crypto');
require('dotenv').config();
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { MasterPricerCalendarUtil } from 'src/common/utility/amadeus/mp-calender.util';
import { AirSellRecommendationUtil } from 'src/common/utility/amadeus/airsell-from-recommendation.util';
import { FareInformativeBestPricingUtil } from 'src/common/utility/amadeus/fare_informative_bestpricing.util';
import { CommandCrypticUtil } from 'src/common/utility/amadeus/command-cryptic.util';
import { FareCheckRulesUtil } from 'src/common/utility/amadeus/fare-checkrules.util';
import { MiniRuleUtil } from 'src/common/utility/amadeus/mini-rules.util';
import { PnrAddMultiElementsUtil } from 'src/common/utility/amadeus/pnr-add-multielements.util';
import { FopCreateFormOfPaymentUtil } from 'src/common/utility/amadeus/fop-createform-of-payment.util';
import { FarePricePNRWithBookingClassUtil } from 'src/common/utility/amadeus/fare-price-pnrwithbookingclass.util';
import { TicketCreateTSTFromPricingUtil } from 'src/common/utility/amadeus/ticket-create-tst-frompricing.util';
import { DocIssuanceIssueTicketUtil } from 'src/common/utility/amadeus/doc-issuance-issuceticket.util';
import { SecuritySignOutUtil } from 'src/common/utility/amadeus/security-signout.util';
import { PnrRetrieveUtil } from 'src/common/utility/amadeus/pnr-retrieve.util';
import { PnrCancelUtil } from 'src/common/utility/amadeus/pnr-cancel.util';
import { QueuePlacePnrUtil } from 'src/common/utility/amadeus/queueplace.util';
import { Sequelize } from 'sequelize-typescript';
import { InjectModel } from '@nestjs/sequelize';
import { AMD_Passenger } from './entities/passenger.entity';
import { AMD_FlightDetails } from './entities/flight-details.entity';
import { AMD_FareDetails } from './entities/fare-details.entity';
import { AMD_Baggage } from './entities/baggage.entity';
import { AMD_Layover } from './entities/layover.entity';
import PnrBooking from '../pnr/pnrBooking/entities/pnrBooking.entity';
import { PnrBookingDto } from '../pnr/pnrBooking/dto/create-pnrBooking.dto';
import User from '../generalModules/users/entities/user.entity';
import { PnrDetail } from '../pnr/pnrDetails';
import { AxiosResponse } from 'axios';
import * as mailgun from 'mailgun-js';
import * as moment from 'moment';
import * as momenttimezone from 'moment-timezone';
import { PNR_BOOKINGS_REPOSITORY } from 'src/shared/constants';
import { STRING } from 'sequelize';
import { INTEGER } from 'sequelize';
import { ResponseService } from 'src/common/utility/response/response.service';
import {
  SAVED_SUCCESS,
  GET_SUCCESS,
  AUTHENTICATION_ERROR,
} from '../../shared/messages.constants';
import { CommissionCategories } from '../serviceCharges/CommissionCategories';
import CommissionPercentage from '../serviceCharges/commissionPercentage/entities/commissionPercentage.entity';
import { Airline } from '../serviceCharges/airline';
import { Sector } from '../serviceCharges/sector';
import { FareClass } from '../serviceCharges/fareClass';
import { PnrServiceCharges } from '../serviceCharges/pnrServiceCharges';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class AmadeusService {
  constructor(
    private readonly soapHeaderUtil: SoapHeaderUtil,
    private readonly masterPriceTravelBoardUtil: MasterPriceTravelBoardUtil,
    private readonly masterPriceTravelCalender: MasterPricerCalendarUtil,
    private readonly fareinformativeBestPricing: FareInformativeBestPricingUtil,
    private readonly farecheckrules: FareCheckRulesUtil,
    private readonly commandCryptic: CommandCrypticUtil,
    private readonly miniRules: MiniRuleUtil,
    private readonly airsellFromRecommendation: AirSellRecommendationUtil,
    private readonly pnrAddMultiElements: PnrAddMultiElementsUtil,
    private readonly fopCreateFormOfPayment: FopCreateFormOfPaymentUtil,
    private readonly fare_price_pnrwithbookingclass: FarePricePNRWithBookingClassUtil,
    private readonly ticketCreateTSTFromPricing: TicketCreateTSTFromPricingUtil,
    private readonly docIssuanceIssueTicket: DocIssuanceIssueTicketUtil,
    private readonly securitySignOut: SecuritySignOutUtil,
    private readonly pnrRetrive: PnrRetrieveUtil,
    private readonly pnrCancel: PnrCancelUtil,
    private readonly queuePlacePnrUtil: QueuePlacePnrUtil,
    private readonly sequelize: Sequelize,
    @Inject(PNR_BOOKINGS_REPOSITORY)
    private pnrBooking: typeof PnrBooking,
    @InjectModel(AMD_Passenger) private passengerModel: typeof AMD_Passenger,
    @InjectModel(AMD_FlightDetails)
    private flightModel: typeof AMD_FlightDetails,
    @InjectModel(AMD_FareDetails) private fareDetails: typeof AMD_FareDetails,
    @InjectModel(AMD_Baggage) private baggageModel: typeof AMD_Baggage,
    @InjectModel(AMD_Layover) private layoverModel: typeof AMD_Layover,
    private readonly responseService: ResponseService,
    private readonly httpService: HttpService,
  ) { }

  // async createBooking(dto: any): Promise<any> {
  //   const transaction = await this.sequelize.transaction({ autocommit: false });

  //   try {
  //     const {
  //       OrderId,
  //       pnr,
  //       phoneNumber,
  //       TotalFare,
  //       pnrBookings,
  //       flightDetails,
  //       leadCreationData,
  //     } = dto;

  //     // Insert Booking Data
  //     const booking = await this.bookingModel.create(
  //       {
  //         orderId: OrderId,
  //         pnr,
  //         phoneNumber,
  //         userEmail: pnrBookings[0]?.userEmail,
  //         totalFare: TotalFare.totalTicketPrice,
  //         baseFare: TotalFare.BaseFare,
  //         taxAmount: TotalFare.taxAmount,
  //         serviceCharges: TotalFare.ServiceCharges,
  //       },
  //       { transaction },
  //     );

  //     // Insert Passengers
  //     if (pnrBookings && pnrBookings.length > 0) {
  //       await this.passengerModel.bulkCreate(
  //         pnrBookings.map((p) => ({
  //           phoneNumber: p.phoneNumber,
  //           userEmail: p.userEmail,
  //           dateOfBirth: p.dateOfBirth,
  //           passportExpiryDate: p.passportExpiryDate,
  //           firstName: p.firstName,
  //           lastName: p.lastName,
  //           title: p.title,
  //           gender: p.gender,
  //           passportNo: p.passportNo,
  //           type: p.type,
  //           orderId: booking.orderId,
  //         })),
  //         { transaction },
  //       );
  //     }

  //     // Insert Flights and Layovers
  //     if (
  //       Array.isArray(flightDetails?.matchedFlights) &&
  //       flightDetails.matchedFlights.length > 0
  //     ) {
  //       for (let i = 0; i < flightDetails.matchedFlights.length; i++) {
  //         const flight = flightDetails.matchedFlights[i];
  //         let segments = flight.flightDetails; // Flight segments

  //         // Check if segments is an object (single segment case)
  //         if (!Array.isArray(segments)) {
  //           segments = [segments]; // Convert to array for uniform processing
  //         }

  //         if (segments.length > 1) {
  //           let previousSegment = null;

  //           for (let j = 0; j < segments.length; j++) {
  //             const segment = segments[j];

  //             const flightEntry = await this.flightModel.create(
  //               {
  //                 departure: segment.flightInformation.location[0].locationId,
  //                 arrival: segment.flightInformation.location[1].locationId,
  //                 departDate:
  //                   segment.flightInformation.productDateTime.dateOfDeparture,
  //                 arrivalDate:
  //                   segment.flightInformation.productDateTime.dateOfArrival,
  //                 departTime:
  //                   segment.flightInformation.productDateTime.timeOfDeparture,
  //                 arrivalTime:
  //                   segment.flightInformation.productDateTime.timeOfArrival,
  //                 marketingCarrier:
  //                   segment.flightInformation.companyId.marketingCarrier,
  //                 flightNumber: segment.flightInformation.flightOrtrainNumber,
  //                 flightDuration:
  //                   segment.flightInformation.attributeDetails
  //                     .attributeDescription,
  //                 bookingClass: leadCreationData.classType,
  //                 cabinClass: 'N/A',
  //                 baggageAllowance: '0',
  //                 orderId: booking.orderId, // Ensure all flights share the same orderId
  //               },
  //               { transaction },
  //             );

  //             if (!flightEntry || !flightEntry.flightId) {
  //               throw new Error(
  //                 `Flight entry creation failed for segment ${j} in matchedFlight ${i}`,
  //               );
  //             }

  //             console.log(
  //               `Flight Created (Matched Flight ${i}, Segment ${j}):`,
  //               flightEntry.flightId,
  //             );

  //             // Insert layover details if there's a previous segment
  //             if (previousSegment) {
  //               await this.layoverModel.create(
  //                 {
  //                   flightId: flightEntry.flightId, // Link layover to the flight
  //                   location:
  //                     previousSegment.flightInformation.location[1].locationId, // Previous arrival location
  //                   duration:
  //                     previousSegment.flightInformation.attributeDetails
  //                       .attributeDescription, // Layover duration
  //                 },
  //                 { transaction },
  //               );

  //               console.log(
  //                 `Layover added at ${previousSegment.flightInformation.location[1].locationId}`,
  //               );
  //             }

  //             previousSegment = segment; // Update for next iteration
  //           }
  //         } else {
  //           // Handle single-segment flights
  //           const segment = segments[0];

  //           const flightEntry = await this.flightModel.create(
  //             {
  //               departure: segment.flightInformation.location[0].locationId,
  //               arrival: segment.flightInformation.location[1].locationId,
  //               departDate:
  //                 segment.flightInformation.productDateTime.dateOfDeparture,
  //               arrivalDate:
  //                 segment.flightInformation.productDateTime.dateOfArrival,
  //               departTime:
  //                 segment.flightInformation.productDateTime.timeOfDeparture,
  //               arrivalTime:
  //                 segment.flightInformation.productDateTime.timeOfArrival,
  //               marketingCarrier:
  //                 segment.flightInformation.companyId.marketingCarrier,
  //               flightNumber: segment.flightInformation.flightOrtrainNumber,
  //               flightDuration:
  //                 segment.flightInformation.attributeDetails
  //                   .attributeDescription,
  //               bookingClass: leadCreationData.classType,
  //               cabinClass: 'N/A',
  //               baggageAllowance: '0',
  //               orderId: booking.orderId, // Ensure all flights share the same orderId
  //             },
  //             { transaction },
  //           );

  //           if (!flightEntry || !flightEntry.flightId) {
  //             throw new Error(
  //               `Single-segment flight entry creation failed for matchedFlight ${i}`,
  //             );
  //           }

  //           console.log(
  //             `Single-segment flight created (Matched Flight ${i}):`,
  //             flightEntry.flightId,
  //           );
  //         }
  //       }
  //     }

  //     // Insert Flights
  //     // if (flightDetails?.matchedFlights && flightDetails.matchedFlights.length > 0) {
  //     //     await this.flightModel.bulkCreate(
  //     //         flightDetails.matchedFlights.map((flight) => ({
  //     //             departure: flight.flightDetails.flightInformation.location[0].locationId,
  //     //             arrival: flight.flightDetails.flightInformation.location[1].locationId,
  //     //             departDate: flight.flightDetails.flightInformation.productDateTime.dateOfDeparture,
  //     //             arrivalDate: flight.flightDetails.flightInformation.productDateTime.dateOfArrival,
  //     //             departTime: flight.flightDetails.flightInformation.productDateTime.timeOfDeparture,
  //     //             arrivalTime: flight.flightDetails.flightInformation.productDateTime.timeOfArrival,
  //     //             marketingCarrier: flight.flightDetails.flightInformation.companyId.marketingCarrier,
  //     //             flightNumber: flight.flightDetails.flightInformation.flightOrtrainNumber,
  //     //             flightDuration: flight.flightDetails.flightInformation.attributeDetails.attributeDescription,
  //     //             bookingClass: leadCreationData.classType,
  //     //             cabinClass: "N/A",
  //     //             baggageAllowance: "0",
  //     //             orderId: booking.orderId,
  //     //         })),
  //     //         { transaction }
  //     //     );
  //     // }

  //     // Insert Fare Details
  //     if (
  //       flightDetails?.recommendation?.paxFareProduct?.fare &&
  //       flightDetails.recommendation.paxFareProduct.fare.length > 0
  //     ) {
  //       await this.fareDetails.bulkCreate(
  //         flightDetails.recommendation.paxFareProduct.fare.map((fare) => ({
  //           orderId: booking.orderId,
  //           rateClass: leadCreationData.classType,
  //           fareAmount: leadCreationData.TotalFare.totalTicketPrice,
  //           currency: 'PKR',
  //           refundPolicy: Array.isArray(fare.pricingMessage.description)
  //             ? fare.pricingMessage.description.join(' ')
  //             : fare.pricingMessage.description,
  //         })),
  //         { transaction },
  //       );
  //     }

  //     // Commit Transaction
  //     await transaction.commit();
  //     return {
  //       success: true,
  //       message: 'Booking Created Successfully',
  //       payload: booking,
  //     };
  //   } catch (error) {
  //     await transaction.rollback();

  //     console.error('Booking Creation Error:', error);

  //     // Identify Error Type & Return Proper Response
  //     if (error.name === 'SequelizeValidationError') {
  //       return {
  //         success: false,
  //         message: 'Validation Error',
  //         errors: error.errors.map((e: any) => e.message),
  //       };
  //     }

  //     if (error.name === 'SequelizeUniqueConstraintError') {
  //       return {
  //         success: false,
  //         message: 'Duplicate Entry Error',
  //         errors: error.errors.map((e: any) => e.message),
  //       };
  //     }

  //     return {
  //       success: false,
  //       message: 'Internal Server Error',
  //       error:
  //         error.message || 'Something went wrong while processing the booking',
  //     };
  //   }
  // }

  async createBookingnew(
    currentUserId: number,
    isCurrentUserAdmin: number,
    dto: PnrBookingDto,
  ): Promise<any> {
    const transaction = await this.sequelize.transaction({ autocommit: false });

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
        leadCreationData,
        sendSmsBranch,
        sendSmsCod,
        branchLabel,
        userLocation,
      } = dto;
      const tolerance = 0.001; // Define your tolerance threshold here
      const baseFare =
        typeof Amount !== 'undefined' ? parseFloat(Amount.BaseFare) || 0 : 0;
      const taxAmount =
        typeof Amount !== 'undefined' ? parseFloat(Amount.taxAmount) || 0 : 0;
      const pnrPayment =
        typeof Amount !== 'undefined' ? parseFloat(Amount.pnrPayment) || 0 : 0;

      const isAmountEqual =
        Math.abs(baseFare + taxAmount - pnrPayment) < tolerance;

      const newPnrBookingRepository = await this.pnrBooking.create(
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
        { transaction },
      );

      const userUpdateEmail = await User.findByPk(currentUserId);
      if (userUpdateEmail) {
        userUpdateEmail.email =
          pnrBookings[0].userEmail || userUpdateEmail.email;
        await userUpdateEmail.save({ transaction });
      }

      // Insert Passengers
      if (pnrBookings && pnrBookings.length > 0) {
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
              { transaction },
            );

            // await this.callLeadCreation(leadCreationData, pnrBooking);
            // external api
          }),
        );
      }

      // Insert Flights and Layovers
      if (
        Array.isArray(flightDetails?.matchedFlights) &&
        flightDetails.matchedFlights.length > 0
      ) {
        for (let i = 0; i < flightDetails.matchedFlights.length; i++) {
          const flight = flightDetails.matchedFlights[i];
          let segments = flight.flightDetails; // Flight segments

          // Check if segments is an object (single segment case)
          if (!Array.isArray(segments)) {
            segments = [segments]; // Convert to array for uniform processing
          }

          if (segments.length > 1) {
            let previousSegment = null;

            for (let j = 0; j < segments.length; j++) {
              const segment = segments[j];

              const flightEntry = await this.flightModel.create(
                {
                  departure: segment.flightInformation.location[0].locationId,
                  arrival: segment.flightInformation.location[1].locationId,
                  departDate:
                    segment.flightInformation.productDateTime.dateOfDeparture,
                  arrivalDate:
                    segment.flightInformation.productDateTime.dateOfArrival,
                  departTime:
                    segment.flightInformation.productDateTime.timeOfDeparture,
                  arrivalTime:
                    segment.flightInformation.productDateTime.timeOfArrival,
                  marketingCarrier:
                    segment.flightInformation.companyId.marketingCarrier,
                  flightNumber: segment.flightInformation.flightOrtrainNumber,
                  flightDuration:
                    segment.flightInformation.attributeDetails
                      .attributeDescription,
                  bookingClass: leadCreationData.classType,
                  cabinClass: 'N/A',
                  baggageAllowance: '0',
                  pnrBookingId: newPnrBookingRepository.id, // Ensure all flights share the same orderId
                },
                { transaction },
              );

              if (!flightEntry || !flightEntry.flightId) {
                throw new Error(
                  `Flight entry creation failed for segment ${j} in matchedFlight ${i}`,
                );
              }

              console.log(
                `Flight Created (Matched Flight ${i}, Segment ${j}):`,
                flightEntry.flightId,
              );

              // Insert layover details if there's a previous segment
              if (previousSegment) {
                await this.layoverModel.create(
                  {
                    flightId: flightEntry.flightId, // Link layover to the flight
                    location:
                      previousSegment.flightInformation.location[1].locationId, // Previous arrival location
                    duration:
                      previousSegment.flightInformation.attributeDetails
                        .attributeDescription, // Layover duration
                  },
                  { transaction },
                );

                console.log(
                  `Layover added at ${previousSegment.flightInformation.location[1].locationId}`,
                );
              }

              previousSegment = segment; // Update for next iteration
            }
          } else {
            // Handle single-segment flights
            const segment = segments[0];

            const flightEntry = await this.flightModel.create(
              {
                departure: segment.flightInformation.location[0].locationId,
                arrival: segment.flightInformation.location[1].locationId,
                departDate:
                  segment.flightInformation.productDateTime.dateOfDeparture,
                arrivalDate:
                  segment.flightInformation.productDateTime.dateOfArrival,
                departTime:
                  segment.flightInformation.productDateTime.timeOfDeparture,
                arrivalTime:
                  segment.flightInformation.productDateTime.timeOfArrival,
                marketingCarrier:
                  segment.flightInformation.companyId.marketingCarrier,
                flightNumber: segment.flightInformation.flightOrtrainNumber,
                flightDuration:
                  segment.flightInformation.attributeDetails
                    .attributeDescription,
                bookingClass: leadCreationData.classType,
                cabinClass: 'N/A',
                baggageAllowance: '0',
                pnrBookingId: newPnrBookingRepository.id, // Ensure all flights share the same orderId
              },
              { transaction },
            );

            if (!flightEntry || !flightEntry.flightId) {
              throw new Error(
                `Single-segment flight entry creation failed for matchedFlight ${i}`,
              );
            }

            console.log(
              `Single-segment flight created (Matched Flight ${i}):`,
              flightEntry.flightId,
            );
          }
        }
      }

      // Insert Fare Details
      if (
        flightDetails?.recommendation?.paxFareProduct?.fare &&
        flightDetails.recommendation.paxFareProduct.fare.length > 0
      ) {
        await this.fareDetails.bulkCreate(
          flightDetails.recommendation.paxFareProduct.fare.map((fare) => ({
            orderId: OrderId,
            rateClass: leadCreationData.classType,
            fareAmount: leadCreationData.TotalFare.totalTicketPrice,
            currency: 'PKR',
            refundPolicy: Array.isArray(fare.pricingMessage.description)
              ? fare.pricingMessage.description.join(' ')
              : fare.pricingMessage.description,
          })),
          { transaction },
        );
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
          { transaction },
        );
      }

      await transaction.commit();

      const user = await User.findByPk(currentUserId);

      if (user) {

        if (sendSmsBranch) {

          const message = `Your booking for ${flightDetails.groupDescription[0]?.departure
            }-${flightDetails.groupDescription[0]?.arrival
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

          const message = `Hello Ticket Pay by COD (Testing).${!sendSmsCod && !sendSmsBranch ? `PNR generated: ${pnr}` : ''
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
        dto,
        userUpdateEmail,
        newPnrBookingRepository.id,
        pnr,
      );

      // Commit Transaction
      //await transaction.commit();
      return this.responseService.createResponse(
        HttpStatus.OK,
        // {},
        { isAmountEqual, newPnrBookingRepository },
        SAVED_SUCCESS,
      );
    } catch (error) {
      await transaction.rollback();

      console.error('Booking Creation Error:', error);

      // Identify Error Type & Return Proper Response
      if (error.name === 'SequelizeValidationError') {
        return {
          success: false,
          message: 'Validation Error',
          errors: error.errors.map((e: any) => e.message),
        };
      }

      if (error.name === 'SequelizeUniqueConstraintError') {
        return {
          success: false,
          message: 'Duplicate Entry Error',
          errors: error.errors.map((e: any) => e.message),
        };
      }

      return {
        success: false,
        message: 'Internal Server Error',
        error:
          error.message || 'Something went wrong while processing the booking',
      };
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
        Your booking for Reference # ${referenceNumber} ( ${bookingData.flightDetails.groupDescription[0]?.departure
      }-${bookingData.flightDetails.groupDescription[0]?.arrival
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
              ${!bookingData.sendSmsCod && !bookingData.sendSmsBranch
        ? 'Card Payment'
        : ''
      }
                ${bookingData.sendSmsCod && !bookingData.sendSmsBranch
        ? 'Cash On Delivery'
        : ''
      }
                ${!bookingData.sendSmsCod && bookingData.sendSmsBranch
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

      return false;
    }
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
        Authorization: `App ${process.env.INFOBIP_KEY ||
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

  async getBookings(page: number, limit: number) {
    const offset = (page - 1) * limit; // Calculate offset for pagination

    const { count, rows } = await this.pnrBooking.findAndCountAll({
      limit,
      offset,
      order: [['createdAt', 'DESC']], // Sort by latest bookings
    });

    return {
      success: true,
      message: 'Bookings retrieved successfully',
      totalRecords: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      data: rows,
    };
  }

  async getBookingByOrderId(orderId: string) {
    // Fetch booking with all related data
    const booking = await this.pnrBooking.findOne({
      where: { orderId },
      include: [
        { model: this.passengerModel, as: 'passengers' },
        { model: this.flightModel, as: 'flights' },
        { model: this.fareDetails, as: 'fareDetails' },
      ],
    });

    if (!booking) {
      throw new NotFoundException(`Booking with Order ID ${orderId} not found`);
    }

    return {
      success: true,
      message: 'Booking details retrieved successfully',
      data: booking,
    };
  }

  public async callCommandCryptic(requestData: any) {
    let soapEnvelope = this.soapHeaderUtil.createSOAPEnvelopeHeaderSession(
      requestData,
      'command_cryptic',
    );

    Object.assign(
      soapEnvelope['soapenv:Envelope'],
      this.commandCryptic.createSOAPEnvelopeBody(requestData),
    );

    const headers = {
      'Content-Type': 'text/xml',
      SOAPAction: 'http://webservices.amadeus.com/HSFREQ_07_3_1A', // Customize based on API requirements
    };
    let xmlreq = create(soapEnvelope).end({ prettyPrint: true });
    console.log(xmlreq);
    try {
      // Make the API call
      const response = await axios.post(process.env.AMADEUS_ENDPOINT, xmlreq, {
        headers,
      });
      return this.soapHeaderUtil.convertXmlToJson(response.data); // Return the data from the API response
    } catch (error) {
      throw new Error(`Failed to fetch data: ${error.response.data}`);
    }
  }

  public async callMasterPriceTravelBoard(requestData: any) {
    let soapEnvelope = this.soapHeaderUtil.createSOAPEnvelopeHeader(
      'master_price_travelboard',
    );

    Object.assign(
      soapEnvelope['soapenv:Envelope'],
      this.masterPriceTravelBoardUtil.createSOAPEnvelopeBody(requestData),
    );

    const headers = {
      'Content-Type': 'text/xml',
      SOAPAction: 'http://webservices.amadeus.com/FMPTBQ_24_1_1A', // Customize based on API requirements
    };
    let xmlreq = create(soapEnvelope).end({ prettyPrint: true });
    console.log(xmlreq);
    try {
      // Make the API call
      const response = await axios.post(process.env.AMADEUS_ENDPOINT, xmlreq, {
        headers,
      });
      return this.soapHeaderUtil.convertXmlToJson(response.data); // Return the data from the API response
    } catch (error) {
      throw new Error(`Failed to fetch data: ${error.response.data}`);
    }
  }

  public async callMasterPriceCalender(requestData: any) {
    let soapEnvelope = this.soapHeaderUtil.createSOAPEnvelopeHeader(
      'master_price_calender',
    );

    Object.assign(
      soapEnvelope['soapenv:Envelope'],
      this.masterPriceTravelCalender.createSOAPEnvelopeBody(requestData),
    );

    const headers = {
      'Content-Type': 'text/xml',
      SOAPAction: 'http://webservices.amadeus.com/FMPCAQ_20_2_1A', // Customize based on API requirements
    };
    let xmlreq = create(soapEnvelope).end({ prettyPrint: true });
    console.log(xmlreq);
    try {
      // Make the API call
      const response = await axios.post(process.env.AMADEUS_ENDPOINT, xmlreq, {
        headers,
      });
      return this.soapHeaderUtil.convertXmlToJson(response.data); // Return the data from the API response
    } catch (error) {
      throw new Error(`Failed to fetch data: ${error.response.data}`);
    }
  }

  public async callFareinformativeBestPricing(requestData: any) {
    let soapEnvelope = this.soapHeaderUtil.createSOAPEnvelopeHeaderSession(
      requestData,
      'fare_informative_best_pricing',
    );

    Object.assign(
      soapEnvelope['soapenv:Envelope'],
      this.fareinformativeBestPricing.createFareInformativePricingRequest(
        requestData.Fare_InformativeBestPricingWithoutPNR,
      ),
    );

    const headers = {
      'Content-Type': 'text/xml',
      SOAPAction: 'http://webservices.amadeus.com/TIBNRQ_23_1_1A', // Customize based on API requirements
    };
    let xmlreq = create(soapEnvelope).end({ prettyPrint: true });
    console.log(xmlreq);
    try {
      // Make the API call
      const response = await axios.post(process.env.AMADEUS_ENDPOINT, xmlreq, {
        headers,
      });
      //return response.data;
      return this.soapHeaderUtil.convertXmlToJson(response.data); // Return the data from the API response
    } catch (error) {
      throw new Error(`Failed to fetch data: ${error.response.data}`);
    }
  }

  public async callFareRulesCheck(requestData: any) {
    let soapEnvelope = this.soapHeaderUtil.createSOAPEnvelopeHeaderSession(
      requestData,
      'fare_rulescheck',
    );

    Object.assign(
      soapEnvelope['soapenv:Envelope'],
      this.farecheckrules.createFareCheckRulesRequest(
        requestData.Fare_CheckRules,
      ),
    );

    const headers = {
      'Content-Type': 'text/xml',
      SOAPAction: 'http://webservices.amadeus.com/FARQNQ_07_1_1A', // Customize based on API requirements
    };
    let xmlreq = create(soapEnvelope).end({ prettyPrint: true });
    console.log(xmlreq);
    try {
      // Make the API call
      const response = await axios.post(process.env.AMADEUS_ENDPOINT, xmlreq, {
        headers,
      });

      return this.soapHeaderUtil.convertXmlToJson(response.data); // Return the data from the API response
    } catch (error) {
      throw new Error(`Failed to fetch data: ${error.response.data}`);
    }
  }

  public async callMiniRules(requestData: any) {
    let soapEnvelope = this.soapHeaderUtil.createSOAPEnvelopeHeaderSession(
      requestData,
      'mini_rules',
    );

    Object.assign(
      soapEnvelope['soapenv:Envelope'],
      this.miniRules.createMiniRuleGetFromRecRequest(
        requestData.MiniRule_GetFromRec,
      ),
    );

    const headers = {
      'Content-Type': 'text/xml',
      SOAPAction: 'http://webservices.amadeus.com/TMRXRQ_23_1_1A', // Customize based on API requirements
    };
    let xmlreq = create(soapEnvelope).end({ prettyPrint: true });
    console.log(xmlreq);
    try {
      // Make the API call
      const response = await axios.post(process.env.AMADEUS_ENDPOINT, xmlreq, {
        headers,
      });

      return this.soapHeaderUtil.convertXmlToJson(response.data); // Return the data from the API response
    } catch (error) {
      throw new Error(`Failed to fetch data: ${error.response.data}`);
    }
  }

  public async callAirSellFromRecommedation(requestData: any) {
    let soapEnvelope = this.soapHeaderUtil.createSOAPEnvelopeHeaderSession(
      requestData,
      'airsell-from-recommendation',
    );

    Object.assign(
      soapEnvelope['soapenv:Envelope'],
      this.airsellFromRecommendation.createSOAPEnvelopeBody(
        requestData.Air_SellFromRecommendation,
      ),
    );

    const headers = {
      'Content-Type': 'text/xml',
      SOAPAction: 'http://webservices.amadeus.com/ITAREQ_05_2_IA', // Customize based on API requirements
    };
    let xmlreq = create(soapEnvelope).end({ prettyPrint: true });
    console.log(xmlreq);
    try {
      // Make the API call
      const response = await axios.post(process.env.AMADEUS_ENDPOINT, xmlreq, {
        headers,
      });
      return this.soapHeaderUtil.convertXmlToJson(response.data); // Return the data from the API response
    } catch (error) {
      throw new Error(`Failed to fetch data: ${error.response.data}`);
    }
  }

  public async callAddMultiElements(requestData: any) {
    let soapEnvelope = this.soapHeaderUtil.createSOAPEnvelopeHeaderSession(
      requestData,
      'add-multi-elements',
    );

    Object.assign(
      soapEnvelope['soapenv:Envelope'],
      this.pnrAddMultiElements.createPNRAddMultiElements(
        requestData.PNR_AddMultiElements,
      ),
    );

    const headers = {
      'Content-Type': 'text/xml',
      SOAPAction: 'http://webservices.amadeus.com/PNRADD_21_1_1A', // Customize based on API requirements
    };
    let xmlreq = create(soapEnvelope).end({ prettyPrint: true });
    console.log(xmlreq);
    try {
      // Make the API call
      const response = await axios.post(process.env.AMADEUS_ENDPOINT, xmlreq, {
        headers,
      });
      return this.soapHeaderUtil.convertXmlToJson(response.data); // Return the data from the API response
    } catch (error) {
      throw new Error(`Failed to fetch data: ${error.response.data}`);
    }
  }

  public async callAddFormofPayment(requestData: any) {
    let soapEnvelope = this.soapHeaderUtil.createSOAPEnvelopeHeaderSession(
      requestData,
      'add-form-of-payment',
    );

    Object.assign(
      soapEnvelope['soapenv:Envelope'],
      this.fopCreateFormOfPayment.createFOPCreateFormOfPayment(
        requestData.FOP_CreateFormOfPayment,
      ),
    );

    const headers = {
      'Content-Type': 'text/xml',
      SOAPAction: 'http://webservices.amadeus.com/TFOPCQ_19_2_1A', // Customize based on API requirements
    };
    let xmlreq = create(soapEnvelope).end({ prettyPrint: true });
    console.log(xmlreq);
    try {
      // Make the API call
      const response = await axios.post(process.env.AMADEUS_ENDPOINT, xmlreq, {
        headers,
      });
      return this.soapHeaderUtil.convertXmlToJson(response.data); // Return the data from the API response
    } catch (error) {
      throw new Error(`Failed to fetch data: ${error.response.data}`);
    }
  }

  public async callFarePricePNRWithBookingClass(requestData: any) {
    let soapEnvelope = this.soapHeaderUtil.createSOAPEnvelopeHeaderSession(
      requestData,
      'fare_price_pnrwithbookingclass',
    );

    Object.assign(
      soapEnvelope['soapenv:Envelope'],
      this.fare_price_pnrwithbookingclass.createFarePricePNRWithBookingClass(
        requestData.Fare_PricePNRWithBookingClass,
      ),
    );

    const headers = {
      'Content-Type': 'text/xml',
      SOAPAction: 'http://webservices.amadeus.com/TPCBRQ_23_2_1A', // Customize based on API requirements
    };
    let xmlreq = create(soapEnvelope).end({ prettyPrint: true });
    console.log(xmlreq);
    try {
      // Make the API call
      const response = await axios.post(process.env.AMADEUS_ENDPOINT, xmlreq, {
        headers,
      });
      return this.soapHeaderUtil.convertXmlToJson(response.data); // Return the data from the API response
    } catch (error) {
      throw new Error(`Failed to fetch data: ${error.response.data}`);
    }
  }

  public async callTicketCreateTSTFromPricing(requestData: any) {
    let soapEnvelope = this.soapHeaderUtil.createSOAPEnvelopeHeaderSession(
      requestData,
      'ticket_create_tst_frompricing',
    );

    Object.assign(
      soapEnvelope['soapenv:Envelope'],
      this.ticketCreateTSTFromPricing.createTicketCreateTSTFromPricing(
        requestData.Ticket_CreateTSTFromPricing,
      ),
    );

    const headers = {
      'Content-Type': 'text/xml',
      SOAPAction: 'http://webservices.amadeus.com/TAUTCQ_04_1_1A', // Customize based on API requirements
    };
    console.log(soapEnvelope);
    let xmlreq;
    try {
      xmlreq = create(soapEnvelope).end({ prettyPrint: true });
      console.log(xmlreq);
    } catch (error) {
      console.log(error);
    }

    try {
      // Make the API call
      const response = await axios.post(process.env.AMADEUS_ENDPOINT, xmlreq, {
        headers,
      });
      return this.soapHeaderUtil.convertXmlToJson(response.data); // Return the data from the API response
    } catch (error) {
      throw new Error(`Failed to fetch data: ${error.response.data}`);
    }
  }

  public async callDocIssuanceIssueTicket(requestData: any) {
    let soapEnvelope = this.soapHeaderUtil.createSOAPEnvelopeHeaderSession(
      requestData,
      'doc_issuance_issuceticket',
    );

    Object.assign(
      soapEnvelope['soapenv:Envelope'],
      this.docIssuanceIssueTicket.createDocIssuanceIssueTicket(
        requestData.DocIssuance_IssueTicket,
      ),
    );

    const headers = {
      'Content-Type': 'text/xml',
      SOAPAction: 'http://webservices.amadeus.com/TTKTIQ_15_1_1A', // Customize based on API requirements
    };
    let xmlreq = create(soapEnvelope).end({ prettyPrint: true });
    console.log(xmlreq);
    try {
      // Make the API call
      const response = await axios.post(process.env.AMADEUS_ENDPOINT, xmlreq, {
        headers,
      });
      return this.soapHeaderUtil.convertXmlToJson(response.data); // Return the data from the API response
    } catch (error) {
      throw new Error(`Failed to fetch data: ${error.response.data}`);
    }
  }

  public async callEndSession(requestData: any) {
    let soapEnvelope = this.soapHeaderUtil.createSOAPEnvelopeHeaderSession(
      requestData,
      'end_session',
    );

    Object.assign(
      soapEnvelope['soapenv:Envelope'],
      this.securitySignOut.createSecuritySignOutRequest(),
    );

    const headers = {
      'Content-Type': 'text/xml',
      SOAPAction: 'http://webservices.amadeus.com/VLSSOQ_04_1_1A', // Customize based on API requirements
    };
    let xmlreq = create(soapEnvelope).end({ prettyPrint: true });
    console.log(xmlreq);
    try {
      // Make the API call
      const response = await axios.post(process.env.AMADEUS_ENDPOINT, xmlreq, {
        headers,
      });
      return this.soapHeaderUtil.convertXmlToJson(response.data); // Return the data from the API response
    } catch (error) {
      throw new Error(`Failed to fetch data: ${error.response.data}`);
    }
  }

  public async callPNRRetrive(requestData: any) {
    let soapEnvelope = this.soapHeaderUtil.createSOAPEnvelopeHeaderSession(
      requestData,
      'retrive_pnr',
    );

    Object.assign(
      soapEnvelope['soapenv:Envelope'],
      this.pnrRetrive.createSOAPEnvelopeBody(requestData),
    );

    const headers = {
      'Content-Type': 'text/xml',
      SOAPAction: 'http://webservices.amadeus.com/PNRRET_21_1_1A', // Customize based on API requirements
    };
    let xmlreq = create(soapEnvelope).end({ prettyPrint: true });
    console.log(xmlreq);
    try {
      // Make the API call
      const response = await axios.post(process.env.AMADEUS_ENDPOINT, xmlreq, {
        headers,
      });
      return this.soapHeaderUtil.convertXmlToJson(response.data); // Return the data from the API response
    } catch (error) {
      throw new Error(`Failed to fetch data: ${error.response.data}`);
    }
  }

  public async callCancelPNR(requestData: any) {
    let soapEnvelope = this.soapHeaderUtil.createSOAPEnvelopeHeaderSession(
      requestData,
      'pnr_cancel',
    );

    Object.assign(
      soapEnvelope['soapenv:Envelope'],
      this.pnrCancel.createPNR_Cancel(requestData.PNR_Cancel),
    );

    const headers = {
      'Content-Type': 'text/xml',
      SOAPAction: 'http://webservices.amadeus.com/PNRXCL_21_1_1A', // Customize based on API requirements
    };
    let xmlreq = create(soapEnvelope).end({ prettyPrint: true });
    console.log(xmlreq);
    try {
      // Make the API call
      const response = await axios.post(process.env.AMADEUS_ENDPOINT, xmlreq, {
        headers,
      });
      return this.soapHeaderUtil.convertXmlToJson(response.data); // Return the data from the API response
    } catch (error) {
      throw new Error(`Failed to fetch data: ${error.response.data}`);
    }
  }

  public async callQueuePlacePNR(requestData: any) {
    let soapEnvelope = this.soapHeaderUtil.createSOAPEnvelopeHeaderSession(
      requestData,
      'queue_place_pnr',
    );

    Object.assign(
      soapEnvelope['soapenv:Envelope'],
      this.queuePlacePnrUtil.createSOAPEnvelopeBody(requestData.Queue_PlacePNR),
    );

    const headers = {
      'Content-Type': 'text/xml',
      SOAPAction: 'http://webservices.amadeus.com/QUQPCQ_03_1_1A', // Customize based on API requirements
    };
    let xmlreq = create(soapEnvelope).end({ prettyPrint: true });
    console.log(xmlreq);
    try {
      // Make the API call
      const response = await axios.post(process.env.AMADEUS_ENDPOINT, xmlreq, {
        headers,
      });
      return this.soapHeaderUtil.convertXmlToJson(response.data); // Return the data from the API response
    } catch (error) {
      throw new Error(`Failed to fetch data: ${error.response.data}`);
    }
  }
}
