import {
  Injectable,
  Inject,
  //  Session
} from '@nestjs/common';

import { PnrUser } from './entities/pnrUsers.entity';
import { PNR_USERS_REPOSITORY } from '../../../shared/constants';

// import { SessionData } from 'express-session';

import { ResponseService } from '../../../common/utility/response/response.service';

// eslint-disable-next-line @typescript-eslint/no-unused-vars

@Injectable()
export class PnrUsersService {
  constructor(
    @Inject(PNR_USERS_REPOSITORY)
    private readonly pnrUserRepository: typeof PnrUser,
    private readonly responseService: ResponseService,
  ) {}

  // Temporary Api
}
