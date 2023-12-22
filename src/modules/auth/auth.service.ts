import {
  Injectable,
  HttpStatus,
  // Session,
  // Req,
} from '@nestjs/common';
// import { Response } from 'express';

// import { Request } from 'express'; // Import the Request object

import { UsersService } from '../../modules/generalModules/users/users.service'; // Adjust the path based on your project structure
import * as bcrypt from 'bcrypt';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from '../../common/utils/jwt.utils';
import { databaseConfig } from 'src/database/config/default';

import { ResponseService } from '../../common/utility/response/response.service';
import {
  AUTHENTICATION_ERROR,
  LOGIN,
  REFRESH_TOKEN_SUCCESS,
  EXCEPTION,
  // LOGOUT_SUCCESS,
  USER_NOT_FOUND,
  INVALID_REFRESH_TOKEN,
} from '../../shared/messages.constants';

const dbConfig = databaseConfig[process.env.NODE_ENV || 'development']; // Load the appropriate config based on environment

const PASSWORD_SECRET = dbConfig.PASSWORD_SECRET;
const JWT_REFRESH_SECRET = dbConfig.JWT_REFRESH_SECRET;
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly responseService: ResponseService,
  ) {}

  async login(
    loginDto: LoginDto,
    // companyId: number,
    // @Session() session: Record<string, any>,
  ): Promise<any> {
    try {
      const user = await this.userService.findUserWithCompanyByEmail(
        loginDto.email,
        // companyId,
      );
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

      const isPasswordValid = await bcrypt.compare(
        loginDto.password + PASSWORD_SECRET,
        user.password,
      );
      if (!isPasswordValid) {
        return this.responseService.createResponse(
          HttpStatus.UNAUTHORIZED,
          null,
          AUTHENTICATION_ERROR,
        );
      }

      // session.user = user;
      const accessToken = generateAccessToken(user, 1);
      const refreshToken = generateRefreshToken(user, 1);

      return this.responseService.createResponse(
        HttpStatus.OK,
        {
          accessToken,
          refreshToken,
          userData: user,
        },
        LOGIN,
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

  async refreshAccessToken(refreshToken: string): Promise<any> {
    try {
      const decoded = verifyToken(refreshToken, JWT_REFRESH_SECRET);

      if (!decoded) {
        return this.responseService.createResponse(
          HttpStatus.UNAUTHORIZED,
          null,
          INVALID_REFRESH_TOKEN,
        );
      }

      const user = await this.userService.findById(decoded.sub);
      if (!user) {
        return this.responseService.createResponse(
          HttpStatus.UNAUTHORIZED,
          null,
          USER_NOT_FOUND,
        );
      }

      const accessToken = generateAccessToken(user, decoded.companyId);
      const refreshTokenNew = generateRefreshToken(user, decoded.companyId);
      return this.responseService.createResponse(
        HttpStatus.OK,
        { access: accessToken, refresh: refreshTokenNew, user: user },
        REFRESH_TOKEN_SUCCESS,
      );
    } catch (error) {
      return this.responseService.createResponse(
        HttpStatus.UNAUTHORIZED,
        null,
        EXCEPTION,
      );
    }
  }

  async validateUser(payload: any) {
    const user = await this.userService.findById(payload.sub);
    if (user) {
      const userDecoded = {
        id: user.id,
        email: user.email,
        companyId: payload.companyId,
      };
      return userDecoded;
    }
    return null;
  }

  async validateUserLocal(email: string, password: string) {
    const user = await this.userService.findUserWithCompanyByEmail(email);
    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(
      password + PASSWORD_SECRET,
      user.password,
    );
    if (!isPasswordValid) {
      return null;
    }

    if (user) {
      return user;
    }
    return null;
  }
  // async logout() {}
}
