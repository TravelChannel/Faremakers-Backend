import { Injectable } from '@nestjs/common';
import { create } from 'xmlbuilder2';

@Injectable()
export class MiniRuleUtil {
  // Function to create MiniRule_GetFromRec structure
  createMiniRuleGetFromRec(
    groupRecords: { referenceType: string; uniqueReference: string }[],
  ) {
    return {
      MiniRule_GetFromRec: {
        groupRecords: groupRecords.map((record) => ({
          recordID: {
            referenceType: record.referenceType,
            uniqueReference: record.uniqueReference,
          },
        })),
      },
    };
  }

  // Function to create a request body for MiniRule_GetFromRec
  createMiniRuleGetFromRecRequest(requestData: any) {
    const body: any = {
      'soapenv:Body': {
        MiniRule_GetFromRec: {},
      },
    };

    // Add groupRecords with uniqueReference set to "ALL" or provided value
    if (requestData.groupRecords) {
      Object.assign(body['soapenv:Body']['MiniRule_GetFromRec'], {
        groupRecords: requestData.groupRecords.map((record: any) => ({
          recordID: {
            referenceType: record.recordID.referenceType,
            uniqueReference: record.recordID.uniqueReference || 'ALL', // Default to "ALL" if not provided
          },
        })),
      });
    }

    return body;
  }

  // Function to convert the object to XML
  convertToXML(object: any) {
    return create({ version: '1.0', encoding: 'UTF-8' })
      .ele(object)
      .end({ prettyPrint: true });
  }
}
