import { Controller, Post, Body } from '@nestjs/common';
import { PayzenService } from './payzen.service';
import { SkipAuth } from 'src/common/decorators/skip-auth.decorator';
import { PaymentDto } from './payment.dto';

@Controller('payzen')
export class PayzenController {
  constructor(private readonly payzenService: PayzenService) {}

  @Post('generate-psid')
  @SkipAuth()
  async generatePsid(@Body() body: any) {
    // Step 1: Generate PSID - authenticate is called inside this method

    return await this.payzenService.generatePsid(body);
  }

  @Post('process')
  @SkipAuth()
  async handlePayment(@Body() paymentData: PaymentDto) {
    // Process the payment data (e.g., save to database, validate, etc.)
    console.log('Received payment data:', paymentData);

    return {
      message: 'Payment processed successfully',
      data: paymentData,
    };
  }
}
