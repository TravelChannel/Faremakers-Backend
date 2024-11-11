import { Controller, Post, Body } from '@nestjs/common';
import { MasterPriceService } from './masterprice.service';
import { SkipAuth } from 'src/common/decorators/skip-auth.decorator';

@Controller('masterprice')
export class MasterPriceController {
  constructor(private readonly soapService: MasterPriceService) {}
  @Post('generate-envelope')
  @SkipAuth()
  async generateSOAPEnvelope(@Body() requestData: any): Promise<string> {
    return await this.soapService.buildSOAPEnvelope(requestData);
  }
}
