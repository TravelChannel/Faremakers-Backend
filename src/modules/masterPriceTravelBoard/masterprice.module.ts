import { Module } from '@nestjs/common';
import { MasterPriceService } from './masterprice.service';
import { MasterPriceController } from './masterprice.controller';

@Module({
  providers: [MasterPriceService],
  controllers: [MasterPriceController],
  exports: [MasterPriceService],
})
export class MasterPriceModule {}
