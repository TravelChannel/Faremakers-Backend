import {
  Injectable,
  Inject,
  HttpStatus,
  //  Session
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { databaseConfig } from 'database/config/default';

import { HttpService } from '@nestjs/axios';

import { UserLoginDto } from './dto/userLogin.dto';
import { UserLoginOtpDto } from './dto/userLoginOtp.dto';
import { AxiosResponse } from 'axios';

import { PnrUser } from './entities/pnrUsers.entity';
import { PNR_USERS_REPOSITORY } from 'shared/constants';
import {
  OTP_SENT_SUCCESS,
  OTP_VALIDATION_FAILS,
  OTP_VALIDATED,
  EXCEPTION,
  AUTHENTICATION_ERROR,
} from 'shared/messages.constants';

// import { SessionData } from 'express-session';

import { ResponseService } from 'common/utility/response/response.service';

// eslint-disable-next-line @typescript-eslint/no-unused-vars

const dbConfig = databaseConfig[process.env.NODE_ENV || 'development']; // Load the appropriate config based on environment
const OTP_SECRET = dbConfig.OTP_SECRET;

@Injectable()
export class PnrUsersService {
  constructor(
    @Inject(PNR_USERS_REPOSITORY)
    private readonly pnrUserRepository: typeof PnrUser,
    private readonly responseService: ResponseService,
    private readonly httpService: HttpService,
  ) {}

  async userLogin(
    userLoginOtpDto: UserLoginOtpDto,
    // @Session() session: Record<string, any>,
  ): Promise<any> {
    try {
      const user = await this.verifyOtp(
        userLoginOtpDto.countryCode,
        userLoginOtpDto.phoneNumber,
        userLoginOtpDto.otp,
      );

      if (!user) {
        return this.responseService.createResponse(
          HttpStatus.UNAUTHORIZED,
          null,
          OTP_VALIDATION_FAILS,
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
      // const accessToken = generateAccessTokenOtpUser(user);
      // const refreshToken = generateRefreshTokenOtpUser(user);

      return this.responseService.createResponse(
        HttpStatus.OK,
        {
          // accessToken,
          // refreshToken,
          userData: user,
        },
        OTP_VALIDATED,
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
      const user = await this.findByPhoneNumber(
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

  async findByPhoneNumber(
    countryCode: string,
    phoneNumber: string,
  ): Promise<PnrUser | null> {
    try {
      let user = await this.pnrUserRepository.findOne({
        where: { phoneNumber, countryCode },
      });
      if (user) {
        return user;
      } else {
        user = await this.pnrUserRepository.create({
          phoneNumber,
          countryCode,
        });
      }
      return user;
    } catch (error) {
      return null;
    }
  }
  async verifyOtp(
    countryCode: string,
    phoneNumber: string,
    otp: string,
  ): Promise<PnrUser | null> {
    try {
      const user = await this.pnrUserRepository.findOne({
        where: { phoneNumber, countryCode },
      });
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

  async generateAndSendOtp(
    countryCode: string,
    phoneNumber: string,
  ): Promise<AxiosResponse> {
    const otp = await this.generateOtp();
    await this.storeOtpInDatabase(countryCode, phoneNumber, otp);
    return this.sendOtpViaApi(countryCode, phoneNumber, otp);
  }

  private async generateOtp(): Promise<string> {
    // Implement your OTP generation logic here
    // For example, use a library or generate a random 6-digit number

    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private async storeOtpInDatabase(
    countryCode: string,
    phoneNumber: string,
    otp: string,
  ): Promise<void> {
    const user = await this.pnrUserRepository.findOne({
      where: { phoneNumber, countryCode },
    });
    const hashedOtp = await bcrypt.hash(otp + OTP_SECRET, 10); // Hash the password with a salt of 10 rounds
    user.otp = hashedOtp;

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
    const url = 'https://qgm2rw.api.infobip.com/sms/2/text/advanced'; // Sabre API endpoint
    const headers = {
      headers: {
        Authorization:
          'App c094e9214ea4e99fa31b84ab6c5c7883-4bca245d-a8b5-4959-baa8-a19c08ec8117',
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    };
    const response = await this.httpService
      .post(url, payload, headers)
      .toPromise();

    return response;
  }
  // Temporary Api
}
