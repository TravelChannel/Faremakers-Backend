import { Controller, Post, Body } from '@nestjs/common';
import { PayzenService } from './payzen.service';
import { SkipAuth } from 'src/common/decorators/skip-auth.decorator';
import { CreatePayZenOrderDto } from './dto/create-payzen-order.dto';
import { PayZenOrder } from './entities/payzen-order.entity';

@Controller('payzen')
export class PayzenController {
  constructor(private readonly payzenService: PayzenService) {}

  @Post('generate-psid')
  @SkipAuth()
  async generatePsid(@Body() body: any) {
    // Step 1: Generate PSID - authenticate is called inside this method

    return await this.payzenService.generatePsid(body);
  }

  @Post('insert-data')
  @SkipAuth()
  async createPayZenOrder(
    @Body() data: CreatePayZenOrderDto,
  ): Promise<PayZenOrder> {
    return this.payzenService.createPayZenOrder(data);
  }
}
