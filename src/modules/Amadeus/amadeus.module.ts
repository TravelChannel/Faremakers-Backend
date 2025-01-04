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
  ],
})
export class AmadeusModule {}
