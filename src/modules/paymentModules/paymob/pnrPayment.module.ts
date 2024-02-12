import { Module } from '@nestjs/common';
import { PnrPaymentService } from './promotions.service';
import { PnrPaymentController } from './promotions.controller';
import { pnrPaymentProviders } from './promotions.providers'; // Import the providers

@Module({
  controllers: [PnrPaymentController],
  providers: [PnrPaymentService, ...pnrPaymentProviders],
})
export class PnrPaymentModule {}
