import { Module } from '@nestjs/common';
import { PnrPaymentService } from './pnrPayment.service';
import { PnrPaymentController } from './pnrPayment.controller';
import { pnrPaymentProviders } from './pnrPayment.providers'; // Import the providers

@Module({
  controllers: [PnrPaymentController],
  providers: [PnrPaymentService, ...pnrPaymentProviders],
})
export class PnrPaymentModule {}
