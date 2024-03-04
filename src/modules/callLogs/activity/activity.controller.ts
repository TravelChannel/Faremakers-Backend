import { Controller, Body, Post } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { SkipAuth } from '../../../common/decorators/skip-auth.decorator';

@Controller('Activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}
  @Post('IncomingCallLogs')
  @SkipAuth()
  async incomingCallLogs(@Body() data) {
    return await this.activityService.incomingCallLogs(data);
  }
  @Post('OutgoingCallLogs')
  @SkipAuth()
  async outgoingCallLogs(@Body() data) {
    return await this.activityService.outgoingCallLogs(data);
  }
}
