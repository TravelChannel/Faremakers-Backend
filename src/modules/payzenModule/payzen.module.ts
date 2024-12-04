import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PayzenController } from './payzen.controller';
import { PayzenService } from './payzen.service';

@Module({
  imports: [
    HttpModule, // Import HttpModule for HTTP requests
  ],
  controllers: [PayzenController],
  providers: [PayzenService], // Provide the PayzenService
})
export class PayzenModule {}
