import { Controller, Post, Body, Query, HttpStatus, Res } from '@nestjs/common';
import { PaymentService } from './jazzcash.service';
import { Response } from 'express';
import { SkipAuth } from 'src/common/decorators/skip-auth.decorator';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @SkipAuth()
  @Post('PaymentAtJazzCash')
  async paymentAtJazzCash(
    @Body()
    requestBody: {
      pp_TxnType: string;
      pp_BillReference: string;
      pp_CustomerID: string;
      pp_Amount: number;
      pp_CustomerMobile: string;
    },
    @Res() res: Response,
  ) {
    try {
      // Pass the entire request body to the service
      const response =
        await this.paymentService.processJazzCashPayment(requestBody);

      return res.status(HttpStatus.OK).json({
        serviceResponse: response.jazzCashForm,
        statusCode: HttpStatus.OK,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Payment processing failed',
        error: error.message,
      });
    }
  }
}
