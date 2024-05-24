import { SEOAirlinesData } from './entities/seoAirlinesData.entity';
import { SEO_AIRLINES_DATA_REPOSITORY } from 'shared/constants';

export const seoAirlinesDataProviders = [
  {
    provide: SEO_AIRLINES_DATA_REPOSITORY,
    useValue: SEOAirlinesData,
  },
];
