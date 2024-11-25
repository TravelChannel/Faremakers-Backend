import { Module } from '@nestjs/common';
import { MasterPriceService } from './masterprice.service';
import { MasterPriceController } from './masterprice.controller';
import { SoapHeaderUtil } from 'src/common/utility/amadeus/soap-header.util';
import { MasterPriceTravelBoardUtil } from 'src/common/utility/amadeus/mp-travelboard.util';

@Module({
  providers: [MasterPriceService, SoapHeaderUtil, MasterPriceTravelBoardUtil],
  controllers: [MasterPriceController],
  exports: [MasterPriceService, SoapHeaderUtil, MasterPriceTravelBoardUtil],
})
export class MasterPriceModule {}
