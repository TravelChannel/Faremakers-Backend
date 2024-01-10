import {
  Controller,
  UseGuards,
  // Session,
} from '@nestjs/common';
// import { Express } from 'express';
// import { SessionData } from 'express-session';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';

import { PnrUsersService } from './pnrUsers.service';
import { SUPERADMIN_ALL_COMPANIES_ADMIN_SUBJECT } from 'src/common/aclSubjects';

@Controller('users')
@UseGuards(RolesGuard)
@Roles(SUPERADMIN_ALL_COMPANIES_ADMIN_SUBJECT)
export class PnrUsersController {
  constructor(private readonly pnrUsersService: PnrUsersService) {}
}
