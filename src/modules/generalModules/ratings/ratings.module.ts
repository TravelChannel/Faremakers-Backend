import { Module } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { RatingsController } from './ratings.controller';
import { ratingsProviders } from './ratings.providers'; // Import the providers

@Module({
  controllers: [RatingsController],
  providers: [RatingsService, ...ratingsProviders],
})
export class RatingsModule {}
