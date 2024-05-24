import { Controller, Body, Post } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { SkipAuth } from 'common/decorators/skip-auth.decorator';
// Test
@Controller('Activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}
  @Post('IncomingCallLogs')
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
