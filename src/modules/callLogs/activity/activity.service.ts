import { Injectable } from '@nestjs/common';

@Injectable()
export class ActivityService {
  async incomingCallLogs(data: any) {
    console.log('incomingCallLogs-', data);
    // const t: Transaction = await sequelize.transaction();
  }
  async outgoingCallLogs(data: any) {
    console.log('outgoingCallLogs-', data);
    // const t: Transaction = await sequelize.transaction();
  }
}
