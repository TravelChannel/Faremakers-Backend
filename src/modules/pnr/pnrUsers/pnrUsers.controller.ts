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
// import { RolesGuard } from '../../../common/guards/roles.guard';
// import { Roles } from '../../../common/decorators/roles.decorator';
import { UserLoginDto } from './dto/userLogin.dto';
import { UserLoginOtpDto } from './dto/userLoginOtp.dto';

import { PnrUsersService } from './pnrUsers.service';
import { SkipAuth } from '../../../common/decorators/skip-auth.decorator';
import { OtpAuthGuard } from '../../../common/guards/otp-auth.guard'; // Adjust the import path

@Controller('pnrUsers')
// @UseGuards(RolesGuard)
export class PnrUsersController {
  constructor(private readonly pnrUsersService: PnrUsersService) {}

  @Post('userLogin')
  @UseGuards(OtpAuthGuard)
  @SkipAuth() // Apply the decorator here to exclude this route
  async userLogin(
    @Body() userLoginOtpDto: UserLoginOtpDto,
    @Session() session: Record<string, any>,
    @Res({ passthrough: true }) res,
  ) {
    try {
      const result = await this.pnrUsersService.userLogin(userLoginOtpDto);

      if (result.status === 'SUCCESS') {
        res.cookie('user_token', result.payload.accessToken, {
          sameSite: 'none', // Set to 'none' for cross-site requests
          httpOnly: true, // Prevent JavaScript access to the cookie
          maxAge: process.env.TOKEN_COOKIE_MAX_AGE,
        });
        res.cookie('refresh_token', result.payload.refreshToken, {
          sameSite: 'none', // Set to 'none' for cross-site requests
          httpOnly: true, // Prevent JavaScript access to the cookie
        });
      }

      return result;
    } catch (error) {
      throw new HttpException('Login failed', HttpStatus.UNAUTHORIZED);
    }
  }

  @Post('requestOtp')
  // @UseGuards(LocalAuthGuard)
  @SkipAuth() // Apply the decorator here to exclude this route
  async requestOtp(
    @Body() userLoginDto: UserLoginDto,
    @Session() session: Record<string, any>,
    @Res({ passthrough: true }) res,
  ) {
    try {
      const result = await this.pnrUsersService.requestOtp(userLoginDto);

      if (result.status === 'SUCCESS') {
        res.cookie('user_token', result.payload.accessToken, {
          sameSite: 'none', // Set to 'none' for cross-site requests
          httpOnly: true, // Prevent JavaScript access to the cookie
          maxAge: process.env.TOKEN_COOKIE_MAX_AGE,
        });
        res.cookie('refresh_token', result.payload.refreshToken, {
          sameSite: 'none', // Set to 'none' for cross-site requests
          httpOnly: true, // Prevent JavaScript access to the cookie
        });
      }

      return result;
    } catch (error) {
      throw new HttpException('Login failed', HttpStatus.UNAUTHORIZED);
    }
  }
}
