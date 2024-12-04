import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PayzenService } from './payzen.service';
import { PayzenToken } from './payzen-token.entity';

@Module({
  imports: [
    HttpModule, // Import HttpModule for HTTP requests
    TypeOrmModule.forFeature([PayzenToken]), // Register the PayzenToken entity for TypeORM
  ],
  providers: [PayzenService], // Provide the PayzenService
  exports: [PayzenService], // Export the service to be used in other modules
})
export class PayzenModule {}
