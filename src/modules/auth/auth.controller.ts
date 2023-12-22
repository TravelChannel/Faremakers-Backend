import {
  Controller,
  HttpStatus,
  Post,
  HttpException,
  Body,
  Get,
  Session,
  Res,
  UseGuards,
  Req,
} from '@nestjs/common';

import { ResponseService } from '../../common/utility/response/response.service';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { EXCEPTION, LOGOUT_SUCCESS } from '../../shared/messages.constants';
import { AuthService } from './auth.service';
import { UsersService } from '../generalModules/users/users.service';

import { SkipAuth } from '../../common/decorators/skip-auth.decorator';
import { LocalAuthGuard } from '../../common/guards/local-auth.guard'; // Adjust the import path

// import { AuthGuard } from '../../common/guards/auth.guard';
// import { RolesGuard } from '../../common/guards/roles.guard';

import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly responseService: ResponseService,
  ) {}

  @Get('getAuthSession')
  async getAuthSession(@Session() session: Record<string, any>) {
    return { id: session.id, session };
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @SkipAuth() // Apply the decorator here to exclude this route
  async login(
    @Body() loginDto: LoginDto,
    @Session() session: Record<string, any>,
    @Res({ passthrough: true }) res,
  ) {
    try {
      const result = await this.authService.login(loginDto);

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
  // @UseGuards(AuthGuard, RolesGuard)

  @Post('refresh-token')
  @SkipAuth()
  async refreshAccessToken(
    @Body() body: { refresh: string },
    @Res({ passthrough: true }) res,
  ) {
    const { refresh } = body;

    const result = await this.authService.refreshAccessToken(refresh);
    if (result.status === 'SUCCESS') {
      res.cookie('user_token', result.payload.access, {
        // secure: true, // Set to true if serving over HTTPS
        sameSite: 'strict', // Set to 'none' for cross-site requests
        httpOnly: true, // Prevent JavaScript access to the cookie
        maxAge: process.env.TOKEN_COOKIE_MAX_AGE,
      });
      res.cookie('refresh_token', result.payload.refresh, {
        // secure: true, // Set to true if serving over HTTPS
        sameSite: 'strict', // Set to 'none' for cross-site requests
        httpOnly: true, // Prevent JavaScript access to the cookie
      });
    }
    return result;
  }
  @Post('logout')
  async logout(@Req() req, @Res({ passthrough: true }) res) {
    try {
      // Clear cookies
      res.clearCookie('user_token');
      res.clearCookie('refresh_token');
      res.clearCookie('NestJs_SESSION');

      // Logout the user
      await req.logout(async (err) => {
        if (err) {
          console.error('Error logging out:', err);
        }

        // Destroy the session
        await new Promise<void>((resolve, reject) => {
          req.session.destroy((err) => {
            if (err) {
              console.error('Error destroying session:', err);
              reject(err);
            } else {
              console.log('Session destroyed');
              resolve();
            }
          });
        });
      });

      console.log('Logout Done');

      // Return a successful response
      return this.responseService.createResponse(
        HttpStatus.OK,
        null,
        LOGOUT_SUCCESS,
      );
    } catch (error) {
      console.error('Logout error:', error);

      // Handle the error and return an unauthorized response
      return this.responseService.createResponse(
        HttpStatus.UNAUTHORIZED,
        error.message,
        EXCEPTION,
      );
    }
  }
}
