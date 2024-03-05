import { Injectable, HttpStatus } from '@nestjs/common';
import { createPool } from './database';
import * as sql from 'mssql';
import * as moment from 'moment';

@Injectable()
export class ActivityService {
  async outgoingCallLogs(outCallLog: any) {
    try {
      console.log('outgoingCallLogs...');

      const DialedNumber = outCallLog.DialedNumber || '';
      const Dialer = outCallLog.Dialer || '';
      const Status = outCallLog.Status || '';
      const CallDuration = outCallLog.CallDuration || '';
      const CallTime = outCallLog.CallTime || '';
      const CallDate = outCallLog.CallDate || '';
      const Recording = outCallLog.Recording || '';
      const IVR_Param_Vals = outCallLog.IVR_Params || '';
      const Feedback_Val = outCallLog.Feedback || '';

      const callDateTimeStr = CallDate + CallTime;
      const callDateTime = moment(callDateTimeStr, 'YYYYMMDDHHmmss').format(
        'YYYY-MM-DD HH:mm:ss.SSS',
      );
      console.log('datee', callDateTime);
      const pool = await createPool();
      const result = await pool
        .request()
        .input('AgentNum', sql.NVarChar, Dialer /* provide value */)
        .input('ClientNum', sql.NVarChar, DialedNumber /* provide value */)
        .input(
          'CallDatetime',
          sql.DateTime,
          // '2024-03-05 11:05:47.537' /* provide value */,
          callDateTime /* provide value */,
        )
        .input('Duration', sql.NVarChar, CallDuration /* provide value */)
        .input('CallStatus', sql.NVarChar, Status /* provide value */)
        .input('AudioFile', sql.NVarChar, Recording /* provide value */)
        .input('CallType', sql.NVarChar, 'OUT' /* provide value */)
        .input(
          'IVR_Param_Vals',
          sql.NVarChar,
          IVR_Param_Vals /* provide value */,
        )
        .input('Feedback_Val', sql.NVarChar, Feedback_Val /* provide value */)
        .execute('InsertCallLogbyAPI_IVR_Params_Leads');

      // return result;
      console.log('result', result);
      const notificationID = result;
      return this.getDataResponse(notificationID);
    } catch (error) {
      return this.getDataResponse(0, error.message);
    }
  }
  async incomingCallLogs(inCallLog: any) {
    try {
      console.log('incomingCallLogs...');
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
      const callDateTime = moment(callDateTimeStr, 'YYYYMMDDHHmmss').format(
        'YYYY-MM-DD HH:mm:ss.SSS',
      );
      console.log('datee', callDateTime);
      const pool = await createPool();
      const result = await pool
        .request()
        .input('AgentNum', sql.NVarChar, Receiver /* provide value */)
        .input('ClientNum', sql.NVarChar, IncomingNumber /* provide value */)
        .input(
          'CallDatetime',
          sql.DateTime,
          // '2024-03-05 11:05:47.537' /* provide value */,
          callDateTime /* provide value */,
        )
        .input('Duration', sql.NVarChar, CallDuration /* provide value */)
        .input('CallStatus', sql.NVarChar, Status /* provide value */)
        .input('AudioFile', sql.NVarChar, Recording /* provide value */)
        .input('CallType', sql.NVarChar, 'IN' /* provide value */)
        .input(
          'IVR_Param_Vals',
          sql.NVarChar,
          IVR_Param_Vals /* provide value */,
        )
        .input('Feedback_Val', sql.NVarChar, Feedback_Val /* provide value */)
        .execute('InsertCallLogbyAPI_IVR_Params_Leads');

      // return result;
      console.log('result', result);
      const notificationID = result;
      return this.getDataResponse(notificationID);
    } catch (error) {
      return this.getDataResponse(0, error.message);
    }
  }

  private getDataResponse(notificationID: number, errorMessage?: string) {
    const status =
      notificationID > 0
        ? 'Notification received successfully..'
        : 'Internal Error Occurred. Please try later.';
    const statusCode =
      notificationID > 0 ? HttpStatus.OK : HttpStatus.INTERNAL_SERVER_ERROR;

    return {
      status,
      statusCode,
      callLogID: notificationID.toString(),
      // callLogID: notificationID,
      errorMessage,
    };
  }
}
