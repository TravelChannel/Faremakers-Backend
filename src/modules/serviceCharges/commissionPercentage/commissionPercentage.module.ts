import { Module } from '@nestjs/common';
import { CommissionPercentageService } from './commissionPercentage.service';
import { CommissionPercentageController } from './commissionPercentage.controller';
import { commissionPercentageProviders } from './commissionPercentage.providers'; // Import the providers

@Module({
  controllers: [CommissionPercentageController],
  providers: [CommissionPercentageService, ...commissionPercentageProviders],
})
export class CommissionPercentageModule {}
