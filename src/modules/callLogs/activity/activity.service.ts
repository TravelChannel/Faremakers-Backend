import { Injectable } from '@nestjs/common';

@Injectable()
export class ActivityService {
  async incomingCallLogs(inCallLog: any) {
    console.log('incomingCallLogs-', inCallLog);
    // const t: Transaction = await sequelize.transaction();
  }
  async outgoingCallLogs(outCallLog: any) {
    console.log('outgoingCallLogs-', outCallLog);
    // const t: Transaction = await sequelize.transaction();
  }
}
