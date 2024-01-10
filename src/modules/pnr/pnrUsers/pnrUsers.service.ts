import {
  Injectable,
  Inject,
  HttpStatus,
  //  Session
} from '@nestjs/common';
import { UserLoginDto } from './dto/userLogin.dto';

import { PnrUser } from './entities/pnrUsers.entity';
import { PNR_USERS_REPOSITORY } from '../../../shared/constants';
import {
  GET_SUCCESS,
  EXCEPTION,
  AUTHENTICATION_ERROR,
} from '../../../shared/messages.constants';

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

  async userLogin(
    userLoginDto: UserLoginDto,
    // @Session() session: Record<string, any>,
  ): Promise<any> {
    try {
      const user = await this.findByPhoneNumber(userLoginDto.phoneNumber);
      if (!user) {
        return this.responseService.createResponse(
          HttpStatus.UNAUTHORIZED,
          null,
          AUTHENTICATION_ERROR,
        );
      }
      const isAuthorized = true;
      if (!isAuthorized) {
        return this.responseService.createResponse(
          HttpStatus.UNAUTHORIZED,
          null,
          AUTHENTICATION_ERROR,
        );
      }

      // const isPasswordValid = await bcrypt.compare(
      //   loginDto.password + PASSWORD_SECRET,
      //   user.password,
      // );
      // if (!isPasswordValid) {
      //   return this.responseService.createResponse(
      //     HttpStatus.UNAUTHORIZED,
      //     null,
      //     AUTHENTICATION_ERROR,
      //   );
      // }

      // session.user = user;
      // const accessToken = generateAccessToken(user, 1);
      // const refreshToken = generateRefreshToken(user, 1);

      return this.responseService.createResponse(
        HttpStatus.OK,
        {
          // accessToken,
          // refreshToken,
          userData: user,
        },
        'Done',
      );
    } catch (error) {
      // Handle any unexpected errors here
      console.error(error);
      return this.responseService.createResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        null,
        EXCEPTION,
      );
    }
  }

  async findByPhoneNumber(phoneNumber: string): Promise<PnrUser | null> {
    try {
      const users = await this.pnrUserRepository.findOne({
        where: { phoneNumber },
      });
      return this.responseService.createResponse(
        HttpStatus.OK,
        users,
        GET_SUCCESS,
      );
    } catch (error) {
      return this.responseService.createResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        null,
        error.message,
      );
    }
  }
  // Temporary Api
}
