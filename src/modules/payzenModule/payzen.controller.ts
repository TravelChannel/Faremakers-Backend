import { Controller, Post, Body } from '@nestjs/common';
import { PayzenService } from './payzen.service';

@Controller('payzen')
export class PayzenController {
  constructor(private readonly payzenService: PayzenService) {}

  @Post('generate-psid')
  async generatePsid(
    @Body() body: { clientId: string; clientSecret: string; params: any },
  ) {
    const { clientId, clientSecret, params } = body;

    // Step 1: Authenticate
    const token = await this.payzenService.authenticate(clientId, clientSecret);

    // Step 2: Generate PSID
    const psid = await this.payzenService.generatePsid(token, params);

    return { psid };
  }
}
