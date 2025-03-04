import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';

@Injectable()
export class PayzenService {
  private authUrl: string;
  private psidUrl: string;
  private tokenFilePath: string;

  constructor(private readonly httpService: HttpService) {
    // Determine the environment and set URLs
    const environment = process.env.PAYZEN_ENV || 'staging'; // Default to staging
    if (environment === 'live') {
      this.authUrl = process.env.LIVE_API_AUTH_URL;
      this.psidUrl = process.env.LIVE_API_PSID_URL;
    } else {
      this.authUrl = process.env.STAGING_API_AUTH_URL;
      this.psidUrl = process.env.STAGING_API_PSID_URL;
    }

    // File path to save the token
    this.tokenFilePath = path.resolve(
      process.cwd(),
      'src/modules/payzenModule/',
      'payzen-token.json',
    );
  }

  // async generateBearerToken(): Promise<string> {
  //   const username = process.env.PAZYEN_AUTH_USERNAME;
  //   const password = process.env.PAYZEN_AUTH_PASSWORD;

  //   if (!username || !password) {
  //     throw new Error('Username or password is not set in the .env file');
  //   }

  //   const authPayload = { username, password };

  //   // Replace the URL with the actual auth endpoint
  //   const authUrl = 'https://example.com/auth/token';

  //   const response = await lastValueFrom(
  //     this.httpService.post(authUrl, authPayload),
  //   );
  //   return response.data.access_token; // Assume API returns { access_token: "<token>" }
  // }

  /**
   * Save the token and expiry time to a file.
   */
  private saveTokenToFile(token: string, expiryTime: Date): void {
    const data = {
      token,
      expiryTime: expiryTime.toISOString(),
    };

    // Ensure the directory exists
    const dirPath = path.dirname(this.tokenFilePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true }); // Create the directory if it doesn't exist
    }

    // Write token to the file
    fs.writeFileSync(
      this.tokenFilePath,
      JSON.stringify(data, null, 2),
      'utf-8',
    );
  }

  /**
   * Retrieve the token from the file.
   */
  private async getTokenFromFile(): Promise<string> {
    // Check if the token file exists
    if (!fs.existsSync(this.tokenFilePath)) {
      // If the file doesn't exist, generate a new token and save it
      return await this.generateAndSaveToken();
    }

    // Read the token from the file
    const tokenData = JSON.parse(fs.readFileSync(this.tokenFilePath, 'utf-8'));

    // Check if the token has expired
    const currentTime = new Date().getTime();
    if (!this.isTokenValid(tokenData.content[0].expiryDate)) {
      // If the token has expired, generate a new token and update the file
      return await this.generateAndSaveToken();
    }

    // Return the valid token
    return tokenData.content[0].token.token;
  }

  isTokenValid(expiryDate: number): boolean {
    const currentTimestamp = Date.now();
    return expiryDate > currentTimestamp;
  }

  private async generateAndSaveToken(): Promise<string> {
    const clientId = process.env.PAYZEN_CLIENT_ID;
    const clientSecret = process.env.PAYZEN_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new HttpException(
        'PAYZEN_CLIENT_ID or PAYZEN_CLIENT_SECRET is not defined in environment variables.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    try {
      const data = JSON.stringify({
        clientId,
        clientSecretKey: clientSecret, // Correct usage of environment variables
      });

      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://stagingapi.payzen.pk:8445/payzen/api/auth/authenticate',
        headers: {
          'Content-Type': 'application/json',
        },
        data,
      };

      // Await the response
      const response = await axios.request(config);

      // Extract token safely
      const token = response.data?.content?.token?.token;

      if (!token) {
        throw new HttpException(
          'Invalid response structure from Payzen API',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      // Save token to file
      fs.writeFileSync(
        this.tokenFilePath,
        JSON.stringify(response.data),
        'utf-8',
      );

      return token; // Return the new token
    } catch (error) {
      console.error('Error authenticating with Payzen:', error);
      throw new HttpException(
        'Authentication with Payzen failed',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  private async generateAndSaveTokenBk(): Promise<string> {
    const clientId = process.env.PAYZEN_CLIENT_ID;
    const clientSecret = process.env.PAYZEN_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new HttpException(
        'PAYZEN_CLIENT_ID or PAYZEN_CLIENT_SECRET is not defined in environment variables.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    try {
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://stagingapi.payzen.pk:8445/payzen/api/auth/authenticate',
        headers: {
          'Content-Type': 'application/json',
        },
        data: JSON.stringify({
          clientId,
          clientSecret,
        }),
      };

      // Await the axios request to get the response
      const response = await axios.request(config);
      console.log('Response Data:', response.data);

      const {
        content: {
          token: { token },
        },
      } = response.data;

      fs.writeFileSync(
        this.tokenFilePath,
        JSON.stringify(response.data),
        'utf-8',
      );
      return token; // Return the new token
    } catch (error) {
      throw new HttpException(
        'Authentication with Payzen failed',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  /**
   * Authenticate with Payzen API to retrieve or validate the token.
   * @returns Auth token
   */
  async authenticate(): Promise<string> {
    // Check for an existing valid token
    const tokenData = await this.getTokenFromFile();

    if (tokenData) {
      return tokenData; // Return the valid token
    }

    // If no valid token exists, generate a new one
    const clientId = process.env.PAYZEN_CLIENT_ID;
    const clientSecret = process.env.PAYZEN_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new HttpException(
        'PAYZEN_CLIENT_ID or PAYZEN_CLIENT_SECRET is not defined in environment variables.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    try {
      // Authenticate with Payzen API
      const response = await firstValueFrom(
        this.httpService.post(this.authUrl, { clientId, clientSecret }),
      );

      const token = response.data.token; // Assuming the response has a `token` field
      const expiryTime = new Date();
      expiryTime.setSeconds(expiryTime.getSeconds() + response.data.expires_in); // Assuming `expires_in` is in seconds

      // Save the new token to the file
      this.saveTokenToFile(token, expiryTime);

      return token;
    } catch (error) {
      throw new HttpException(
        'Authentication with Payzen failed',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  /**
   * Generate a PSID using Payzen API.
   * @param requestBody - Request body parameters for PSID generation
   * @returns PSID
   */
  async generatePsidBK(requestBody: Record<string, any>) {
    const token = await this.authenticate(); // Automatically fetch the token
    try {
      const response = await firstValueFrom(
        this.httpService.post(this.psidUrl, JSON.stringify(requestBody), {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }),
      );

      // Ensure response data is valid
      if (response && response.data && response.data.status === 'OK') {
        return {
          status: response.data.status,
          message: response.data.message,
          content: response.data.content,
        };
      } else {
        throw new HttpException(
          response?.data?.message || 'Failed to generate PSID',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    } catch (error) {
      console.error('Error generating PSID:', error.message);

      // Log additional error details if available
      if (error.response) {
        console.error('Error Response Data:', error.response.data);
      }

      throw new HttpException(
        'Failed to generate PSID with Payzen',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async generatePsid(requestBody: Record<string, any>) {
    const token = await this.authenticate();
    console.log('Generated Token:', token);

    try {
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://stagingapi.payzen.pk:8445/payzen/api/psid',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        data: JSON.stringify(requestBody),
      };

      // Await the axios request to get the response
      const response = await axios.request(config);
      console.log('Response Data:', response.data);

      // Validate response and return the PSID
      if (response.data && response.data.status === 'OK') {
        return {
          status: response.data.status,
          message: response.data.message,
          content: response.data.content, // Assuming PSID is inside "content"
        };
      } else {
        throw new HttpException(
          response.data?.message || 'Failed to generate PSID',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    } catch (error) {
      console.error(
        'Error generating PSID:',
        error.response?.data || error.message,
      );
      throw new HttpException(
        'Failed to generate PSID',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
