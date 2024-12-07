import { Module } from '@nestjs/common';
import { AmadeusService } from './amadeus.service';
import { AmadeusController } from './amadeus.controller';
import { SoapHeaderUtil } from 'src/common/utility/amadeus/soap-header.util';
import { MasterPriceTravelBoardUtil } from 'src/common/utility/amadeus/mp-travelboard.util';
import { MasterPricerCalendarUtil } from 'src/common/utility/amadeus/mp-calender.util';
import { AirSellRecommendationUtil } from 'src/common/utility/amadeus/airsell-from-recommendation.util';

@Module({
  providers: [
    AmadeusService,
    SoapHeaderUtil,
    MasterPriceTravelBoardUtil,
    MasterPricerCalendarUtil,
    AirSellRecommendationUtil,
  ],
  controllers: [AmadeusController],
  exports: [
    AmadeusService,
    SoapHeaderUtil,
    MasterPriceTravelBoardUtil,
    MasterPricerCalendarUtil,
    AirSellRecommendationUtil,
  ],
})
export class AmadeusModule {}
