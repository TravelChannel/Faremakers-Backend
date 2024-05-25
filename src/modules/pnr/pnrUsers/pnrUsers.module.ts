import { Module } from '@nestjs/common';
import { PnrUsersController } from './pnrUsers.controller';
// import { SessionSerializer } from 'src/database/sessionSerializer';
import { PassportModule } from '@nestjs/passport';

import { PnrUsersService } from './pnrUsers.service';
import { PnrUsersProviders } from './pnrUsers.providers';
import { HttpModule } from '@nestjs/axios';
import { OtpStrategy } from './otp.strategy';

@Module({
  imports: [
    HttpModule,
    PassportModule.register({ defaultStrategy: 'OTPStrategy', session: true }),
  ],
  controllers: [PnrUsersController],
  providers: [
    PnrUsersService,
    OtpStrategy,
    // SessionSerializer,
    ...PnrUsersProviders,
  ],
  exports: [PnrUsersService],
})
export class PnrUsersModule {}
