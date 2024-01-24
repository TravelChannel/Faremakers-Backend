import { Module } from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { PromotionsController } from './promotions.controller';
import { promotionsProviders } from './promotions.providers'; // Import the providers

@Module({
  controllers: [PromotionsController],
  providers: [PromotionsService, ...promotionsProviders],
})
export class PromotionsModule {}
