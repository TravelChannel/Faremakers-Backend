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



@Module({
  imports: [
    SequelizeModule.forFeature([
      AMD_Booking,
      AMD_Passenger,
      AMD_FlightDetails,
      AMD_Layover,
      AMD_FareDetails,
      AMD_Baggage,
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
