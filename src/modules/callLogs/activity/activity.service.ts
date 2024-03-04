import { Injectable, HttpStatus } from '@nestjs/common';
import { createPool } from './database';
import * as sql from 'mssql';

@Injectable()
export class ActivityService {
  async incomingCallLogs(inCallLog: any) {
    try {
      console.log('incomingCallLogs..');
      const IncomingNumber = (inCallLog.IncomingNumber || '')
        .replace('0+', '')
        .replace(/^0\s*/, '');
      const Receiver = inCallLog.Receiver || '';
      const Status = inCallLog.Status || '';
      const CallDuration = inCallLog.CallDuration || '';
      const CallTime = inCallLog.CallTime || '';
      const CallDate = inCallLog.CallDate || '';
      const Recording = inCallLog.Recording || '';
      const IVR_Param_Vals = inCallLog.IVR_Params || '';
      const Feedback_Val = inCallLog.Feedback || '';

      const callDateTimeStr = CallDate + CallTime;
      const callDateTime = new Date(
        callDateTimeStr.replace(
          /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/,
          '$1-$2-$3T$4:$5:$6',
        ),
      );

      // const callDateTime = new Date(callDateTimeStr);
      // callDateTimeStr = '';
      const pool = await createPool();
      const result = await pool
        .request()
        .input('AgentNum', sql.NVarChar, '1223dsdx' /* provide value */)
        .input('ClientNum', sql.NVarChar, IncomingNumber /* provide value */)
        // .input('callDateTime', callDateTime /* provide value */)
        // .input('callDateTime', '' /* provide value */)
        .input(
          'CallDatetime',
          sql.DateTime,
          '20220304120030' /* provide value */,
        )
        .input('Duration', sql.NVarChar, CallDuration /* provide value */)
        .input('Status', sql.NVarChar, Status /* provide value */)
        .input('Recording', sql.NVarChar, Recording /* provide value */)
        .input(
          'IVR_Param_Vals',
          sql.NVarChar,
          IVR_Param_Vals /* provide value */,
        )
        .input('Feedback_Val', sql.NVarChar, Feedback_Val /* provide value */)
        .execute('InsertCallLogbyAPI_IVR_Params_Leads');

      return result;
      console.log('result..', result);
      const notificationID = result;
      return this.getDataResponse(notificationID);
    } catch (error) {
      return this.getDataResponse(0, error.message);
    }
  }

  private getDataResponse(notificationID: number, errorMessage?: string) {
    const status =
      notificationID > 0
        ? 'Notification received successfully.'
        : 'Internal Error Occurred. Please try later.';
    const statusCode =
      notificationID > 0 ? HttpStatus.OK : HttpStatus.INTERNAL_SERVER_ERROR;

    return {
      status,
      statusCode,
      callLogID: notificationID.toString(),
      errorMessage,
    };
  }
  async outgoingCallLogs(outCallLog: any) {
    console.log('outgoingCallLogs-', outCallLog);
    // const t: Transaction = await sequelize.transaction();
  }
}
