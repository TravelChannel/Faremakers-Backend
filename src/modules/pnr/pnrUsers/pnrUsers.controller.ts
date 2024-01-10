import {
  Controller,
  UseGuards,
  HttpStatus,
  HttpException,
  Res,
  Session,
  Body,
  Post,
  // Session,
} from '@nestjs/common';
// import { Express } from 'express';
// import { SessionData } from 'express-session';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { UserLoginDto } from './dto/userLogin.dto';

import { PnrUsersService } from './pnrUsers.service';
import { SUPERADMIN_ALL_COMPANIES_ADMIN_SUBJECT } from 'src/common/aclSubjects';
import { SkipAuth } from '../../../common/decorators/skip-auth.decorator';
import { LocalAuthGuard } from '../../../common/guards/local-auth.guard'; // Adjust the import path

@Controller('users')
@UseGuards(RolesGuard)
@Roles(SUPERADMIN_ALL_COMPANIES_ADMIN_SUBJECT)
export class PnrUsersController {
  constructor(private readonly pnrUsersService: PnrUsersService) {}

  @Post('userLogin')
  @UseGuards(LocalAuthGuard)
  @SkipAuth() // Apply the decorator here to exclude this route
  async userLogin(
    @Body() userLoginDto: UserLoginDto,
    @Session() session: Record<string, any>,
    @Res({ passthrough: true }) res,
  ) {
    try {
      const result = await this.pnrUsersService.userLogin(userLoginDto);

      if (result.status === 'SUCCESS') {
        res.cookie('user_token', result.payload.accessToken, {
          // secure: true, // Set to true if serving over HTTPS
          sameSite: 'strict', // Set to 'none' for cross-site requests
          httpOnly: true, // Prevent JavaScript access to the cookie
          maxAge: process.env.TOKEN_COOKIE_MAX_AGE,
        });
        res.cookie('refresh_token', result.payload.refreshToken, {
          // secure: true, // Set to true if serving over HTTPS
          sameSite: 'strict', // Set to 'none' for cross-site requests
          httpOnly: true, // Prevent JavaScript access to the cookie
        });
      }

      return result;
    } catch (error) {
      throw new HttpException('Login failed', HttpStatus.UNAUTHORIZED);
    }
  }
}
