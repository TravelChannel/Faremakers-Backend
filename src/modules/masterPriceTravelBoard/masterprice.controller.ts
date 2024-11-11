import { Controller, Post, Body } from '@nestjs/common';
import { MasterPriceService } from './masterprice.service';

@Controller('masterprice')
export class MasterPriceController {
  constructor(private readonly soapService: MasterPriceService) {}
  @Post('generate-envelope')
  async generateSOAPEnvelope(@Body() requestData: any): Promise<string> {
    return await this.soapService.buildSOAPEnvelope(requestData);
  }
}
