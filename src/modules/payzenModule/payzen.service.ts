import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PayzenService {
  private authUrl: string;
  private psidUrl: string;

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
  }

  /**
   * Authenticate with Payzen API to retrieve the token.
   * @returns Auth token
   */
  async authenticate(): Promise<string> {
    const clientId = process.env.PAYZEN_CLIENT_ID;
    const clientSecret = process.env.PAYZEN_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new HttpException(
        'PAYZEN_CLIENT_ID or PAYZEN_CLIENT_SECRET is not defined in environment variables.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    try {
      const response = await firstValueFrom(
        this.httpService.post(this.authUrl, { clientId, clientSecret }),
      );
      return response.data.token; // Assuming the response has a `token` field
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
  async generatePsid(requestBody: Record<string, any>): Promise<string> {
    const token = await this.authenticate(); // Automatically fetch the token
    console.log(token);
    try {
      const response = await firstValueFrom(
        this.httpService.post(this.psidUrl, requestBody, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      );
      return response.data.psid; // Assuming the response has a `psid` field
    } catch (error) {
      throw new HttpException(
        'Failed to generate PSID with Payzen',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
