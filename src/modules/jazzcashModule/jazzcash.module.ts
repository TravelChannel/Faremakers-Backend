import { Module } from '@nestjs/common';
import { PaymentService } from './jazzcash.service';
import { PaymentController } from './jazzcash.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      // Loads environment variables from .env
      isGlobal: true, // Make it accessible globally across all modules
    }),
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService], // Export if you need to use it in other modules
})
export class JazzCashModule {}
