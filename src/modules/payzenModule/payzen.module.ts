import { Module } from '@nestjs/common';
import { PayzenService } from './payzen.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule], // Import HttpModule for HTTP requests
  providers: [PayzenService],
  exports: [PayzenService], // Export the service to be used in other modules
})
export class PayzenModule {}
