import { Module } from '@nestjs/common';
import { PnrUsersController } from './pnrUsers.controller';

import { PnrUsersService } from './pnrUsers.service';
import { PnrUsersProviders } from './pnrUsers.providers';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [PnrUsersController],
  providers: [PnrUsersService, ...PnrUsersProviders],
  exports: [PnrUsersService],
})
export class PnrUsersModule {}
