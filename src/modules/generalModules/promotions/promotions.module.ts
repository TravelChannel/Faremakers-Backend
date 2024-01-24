import { Module } from '@nestjs/common';
import { PromotionsService } from './roles.service';
import { PromotionsController } from './roles.controller';
import { promotionsProvider } from './roles.providers'; // Import the providers

@Module({
  controllers: [PromotionsController],
  providers: [PromotionsService, ...promotionsProvider],
})
export class PromotionsModule {}
