import { Module, Global } from '@nestjs/common';
import { ResponseService } from './response.service';

@Global()
@Module({
  providers: [ResponseService], // Include ResponseService in providers
  exports: [ResponseService], // Export ResponseService to make it available for other modules
})
export class ResponseModule {}
