import { Controller, Body, Post, Get } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { SkipAuth } from '../../../common/decorators/skip-auth.decorator';

@Controller('Activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}
  @Get('IncomingCallLogs')
  @SkipAuth()
  async incomingCallLogs(@Body() inCallLog) {
    return await this.activityService.incomingCallLogs(inCallLog);
  }
  @Post('OutgoingCallLogs')
  @SkipAuth()
  async outgoingCallLogs(@Body() outCallLog) {
    return await this.activityService.outgoingCallLogs(outCallLog);
  }
}
