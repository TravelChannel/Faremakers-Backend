import { Module } from '@nestjs/common';
import { MasterPriceService } from './masterprice.service';
import { MasterPriceController } from './masterprice.controller';
import { SoapHeaderUtil } from 'src/common/utility/amadeus/soap-header.util';
import { MasterPriceTravelBoardUtil } from 'src/common/utility/amadeus/mp-travelboard.util';
import { MasterPricerCalendarUtil } from 'src/common/utility/amadeus/mp-calender.util';

@Module({
  providers: [
    MasterPriceService,
    SoapHeaderUtil,
    MasterPriceTravelBoardUtil,
    MasterPricerCalendarUtil,
  ],
  controllers: [MasterPriceController],
  exports: [
    MasterPriceService,
    SoapHeaderUtil,
    MasterPriceTravelBoardUtil,
    MasterPricerCalendarUtil,
  ],
})
export class MasterPriceModule {}
