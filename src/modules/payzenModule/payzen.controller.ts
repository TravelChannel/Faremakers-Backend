import { Controller, Post, Body,UseGuards } from '@nestjs/common';
import { PayzenService } from './payzen.service';
import { SkipAuth } from 'src/common/decorators/skip-auth.decorator';
import { CreatePayZenOrderDto } from './dto/create-payzen-order.dto';
import { PayZenOrder } from './entities/payzen-order.entity';
import { RolesGuard } from '../../common/guards/roles.guard';


@Controller('payzen')
@UseGuards(RolesGuard)
export class PayzenController {
  constructor(private readonly payzenService: PayzenService) {}

  @Post('generate-psid')
  @SkipAuth()
  async generatePsid(@Body() body: any) {
    // Step 1: Generate PSID - authenticate is called inside this method

    return await this.payzenService.generatePsid(body);
  }

  @Post('insert-data')
  async createPayZenOrder(
    @Body() data: CreatePayZenOrderDto,
  ): Promise<{ status: string; message: string }> {
    return this.payzenService.createOrUpdate(data);
  }
}
