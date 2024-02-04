import { Module } from '@nestjs/common';
import { SEOAirlinesDataService } from './seoAirlinesData.service';
import { SEOAirlinesDataController } from './seoAirlinesData.controller';
import { seoAirlinesDataProviders } from './seoAirlinesData.providers'; // Import the providers

@Module({
  controllers: [SEOAirlinesDataController],
  providers: [SEOAirlinesDataService, ...seoAirlinesDataProviders],
})
export class SEOAirlinesDataModule {}
