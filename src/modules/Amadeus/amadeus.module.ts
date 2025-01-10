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

@Module({
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
  ],
})
export class AmadeusModule {}
