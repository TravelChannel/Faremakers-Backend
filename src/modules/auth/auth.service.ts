import {
  Injectable,
  HttpStatus,
  // Session,
  // Req,
} from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { UserLoginDto } from './dto/userLogin.dto';
import { HttpService } from '@nestjs/axios';

// import { Response } from 'express';

// import { Request } from 'express'; // Import the Request object

import { UsersService } from 'src/modules/generalModules/users/users.service'; // Adjust the path based on your project structure
import * as bcrypt from 'bcrypt';
import {
  generateAccessTokenOtpUser,
  generateRefreshTokenOtpUser,
  verifyToken,
} from 'src/common/utils/jwt.utils';
import { databaseConfig } from 'src/database/config/default';

import { ResponseService } from 'src/common/utility/response/response.service';
import {
  AUTHENTICATION_ERROR,
  OTP_SENT_SUCCESS,
  LOGIN,
  REFRESH_TOKEN_SUCCESS,
  EXCEPTION,
  // LOGOUT_SUCCESS,
  USER_NOT_FOUND,
  INVALID_REFRESH_TOKEN,
} from 'src/shared/messages.constants';

const dbConfig = databaseConfig[process.env.NODE_ENV || 'development']; // Load the appropriate config based on environment

const PASSWORD_SECRET = dbConfig.PASSWORD_SECRET;
const JWT_REFRESH_SECRET = dbConfig.JWT_REFRESH_SECRET;
const OTP_SECRET = dbConfig.OTP_SECRET;

import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly responseService: ResponseService,
    private readonly httpService: HttpService,
  ) {}

  async login(
    loginDto: LoginDto,
    // @Session() session: Record<string, any>,
  ): Promise<any> {
    try {
      const user = await this.userService.verifyOtp(
        loginDto.countryCode,
        loginDto.phoneNumber,
        loginDto.otp,
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
      const accessToken = generateAccessTokenOtpUser(user);
      const refreshToken = generateRefreshTokenOtpUser(user);

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

  async requestOtp(
    userLoginDto: UserLoginDto,
    // @Session() session: Record<string, any>,
  ): Promise<any> {
    try {
      const user = await this.userService.findByPhoneNumber(
        userLoginDto.countryCode,
        userLoginDto.phoneNumber,
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
      const response = await this.generateAndSendOtp(
        userLoginDto.countryCode,
        userLoginDto.phoneNumber,
      );
      // return response.data; // Assuming the API response contains relevant data
      return this.responseService.createResponse(
        HttpStatus.OK,
        response.data,
        `${OTP_SENT_SUCCESS} on +${userLoginDto.countryCode}-${userLoginDto.phoneNumber}`,
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
  async generateAndSendOtp(
    countryCode: string,
    phoneNumber: string,
  ): Promise<AxiosResponse> {
    const otp = await this.generateOtp();
    // const otp = '123456';
    await this.storeOtpInDatabase(countryCode, phoneNumber, otp);
    return this.sendOtpViaApi(countryCode, phoneNumber, otp);
  }

  private async storeOtpInDatabase(
    countryCode: string,
    phoneNumber: string,
    otp: string,
  ): Promise<void> {
    const user = await this.userService.findByPhoneNumber(
      countryCode,
      phoneNumber,
    );
    const hashedOtp = await bcrypt.hash(otp + OTP_SECRET, 10); // Hash the password with a salt of 10 rounds
    user.otp = hashedOtp;

    console.log('***** hashedOtp********', otp);
    await user.save(); // Save the changes
  }

  private async sendOtpViaApi(
    countryCode: string,
    phoneNumber: string,
    otp: string,
  ): Promise<AxiosResponse> {
    // Implement your OTP sending logic here
    // Use Axios or any other HTTP client library to make the API request
    // Make sure to replace the following placeholders with your actual API details
    const payload = {
      messages: [
        {
          from: 'Faremaker',
          destinations: [{ to: `${countryCode}${phoneNumber}` }],
          text: `Your Pin: ${otp}`,
        },
      ],
    }; // Sabre API endpoint
    const url =
      process.env.INFOBIP_URL ||
      'https://qgm2rw.api.infobip.com/sms/2/text/advanced'; // Sabre API endpoint
    const headers = {
      headers: {
        Authorization: `App ${
          process.env.INFOBIP_KEY ||
          'ac1a6fbed96a4d5f8dc7f16f97d5ba93-c292b377-20a3-4a8c-9c65-ff43faaa315f'
        }`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    };
    const response = await this.httpService
      .post(url, payload, headers)
      .toPromise();

    return response;
  }
  private async generateOtp(): Promise<string> {
    // Implement your OTP generation logic here
    // For example, use a library or generate a random 6-digit number

    return Math.floor(100000 + Math.random() * 900000).toString();
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

      const accessToken = generateAccessTokenOtpUser(
        user,
        // decoded.isSuperAdmin
      );
      const refreshTokenNew = generateRefreshTokenOtpUser(
        user,
        // decoded.isSuperAdmin,
      );
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
        roleId: user.roleId,
        phoneNumber: user.phoneNumber,
        isSuperAdmin: user.isSuperAdmin,
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
  async validateUserLocalOtp(
    countryCode: string,
    phoneNumber: string,
    otp: string,
  ): Promise<any | null> {
    try {
      const user = await this.userService.findByPhoneNumber(
        countryCode,
        phoneNumber,
      );
      if (user) {
        const isOtpValid = await bcrypt.compare(otp + OTP_SECRET, user.otp);
        if (!isOtpValid) {
          return null;
        }
        return user;
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  // async logout() {}
}
