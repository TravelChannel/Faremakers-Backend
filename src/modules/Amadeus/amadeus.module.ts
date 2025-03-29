import { Module } from '@nestjs/common';
import { AmadeusService } from './amadeus.service';
import { AmadeusController } from './amadeus.controller';
import { SoapHeaderUtil } from 'src/common/utility/amadeus/soap-header.util';
import { MasterPriceTravelBoardUtil } from 'src/common/utility/amadeus/mp-travelboard.util';
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

import { AMD_Booking } from './entities/booking.entity';
import { AMD_Passenger } from './entities/passenger.entity';
import { AMD_FlightDetails } from './entities/flight-details.entity';
import { AMD_Layover } from './entities/layover.entity';
import { AMD_FareDetails } from './entities/fare-details.entity';
import { AMD_Baggage } from './entities/baggage.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { PnrBookingsProviders } from '../pnr/pnrBooking/pnrBookings.providers';
import PnrBooking from '../pnr/pnrBooking/entities/pnrBooking.entity';
import User from '../generalModules/users/entities/user.entity';
import { PnrDetail } from '../pnr/pnrDetails';
import { FlightDetails } from '../pnr/flightDetails';
import { PnrServiceCharges } from '../serviceCharges/pnrServiceCharges';
import PnrPayment from '../paymentModules/paymob/entities/pnrPayment.entity';
import Role from '../generalModules/roles/entities/role.entity';
import { ExtraBaggage } from '../pnr/extraBaggage';
import { BaggageAllowance } from '../pnr/baggageAllowance';
import { BookingFlight } from '../pnr/bookingFlight';
import { Fare } from '../pnr/fare';
import { GroupDescription } from '../pnr/groupDescription';
import { SchedualDetGet } from '../pnr/schedualDetGet';
import { FlightSegments } from '../pnr/flightSegments';
import { CommissionCategories } from '../serviceCharges/CommissionCategories';
import { TotalFare } from '../pnr/totalFare';
import { PassengerInfo } from '../pnr/passengerInfo';
import { PassengerInfoList } from '../pnr/passengerInfoList';
import { InnerSchedualDetGet } from '../pnr/InnerSchedualDetGet';
import { CurrencyConversion } from '../pnr/currencyConversion';
import { Arrival } from '../pnr/arrival';
import { Departure } from '../pnr/departure';
import { Carrier } from '../pnr/carrier';
import { Equipment } from '../pnr/equipment';


@Module({
  imports: [
    SequelizeModule.forFeature([
      AMD_Booking,
      AMD_Passenger,
      AMD_FlightDetails,
      AMD_Layover,
      AMD_FareDetails,
      AMD_Baggage,
      PnrBooking,
      User,
      PnrDetail,
      FlightDetails,
      PnrServiceCharges,
      PnrPayment,
      Role,
      ExtraBaggage,
      BaggageAllowance,
      BookingFlight,
      Fare,
      GroupDescription,
      SchedualDetGet,
      FlightSegments,
      CommissionCategories,
      TotalFare,
      PassengerInfo,
      PassengerInfoList,
      InnerSchedualDetGet,
      CurrencyConversion,
      Arrival,
      Departure,
      Carrier,
      Equipment
    ]),
  ],
  providers: [
    AmadeusService,
    SoapHeaderUtil,
    MasterPriceTravelBoardUtil,
    MasterPricerCalendarUtil,
    AirSellRecommendationUtil,
    FareInformativeBestPricingUtil,
    CommandCrypticUtil,
    FareCheckRulesUtil,
    MiniRuleUtil,
    PnrAddMultiElementsUtil,
    FopCreateFormOfPaymentUtil,
    FarePricePNRWithBookingClassUtil,
    TicketCreateTSTFromPricingUtil,
    DocIssuanceIssueTicketUtil,
    SecuritySignOutUtil,
    PnrRetrieveUtil,
    PnrCancelUtil,
    QueuePlacePnrUtil,
    ...PnrBookingsProviders
  ],
  controllers: [AmadeusController],
  exports: [
    AmadeusService,
    SoapHeaderUtil,
    MasterPriceTravelBoardUtil,
    MasterPricerCalendarUtil,
    AirSellRecommendationUtil,
    FareInformativeBestPricingUtil,
    CommandCrypticUtil,
    FareCheckRulesUtil,
    MiniRuleUtil,
    PnrAddMultiElementsUtil,
    FopCreateFormOfPaymentUtil,
    FarePricePNRWithBookingClassUtil,
    TicketCreateTSTFromPricingUtil,
    DocIssuanceIssueTicketUtil,
    SecuritySignOutUtil,
    PnrRetrieveUtil,
    PnrCancelUtil,
    QueuePlacePnrUtil
  ],
})
export class AmadeusModule {}
