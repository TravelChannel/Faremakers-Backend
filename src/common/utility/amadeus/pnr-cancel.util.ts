import { Injectable } from '@nestjs/common';
import { create } from 'xmlbuilder2';

@Injectable()
export class PnrCancelUtil {
  // Method to create PNR Actions
  createPnrActions(optionCodes: string[]) {
    return {
      pnrActions: {
        ...optionCodes,
      },
    };
  }

  // Method to create Cancel Elements
  createCancelElements(entryType: string) {
    return {
      cancelElements: {
        entryType,
      },
    };
  }

  // Method to convert the object to XML format
  convertToXML(object: any) {
    return create({ version: '1.0', encoding: 'UTF-8' })
      .ele(object)
      .end({ prettyPrint: true });
  }

  // Method to create the full PNR Cancel request
  createPNR_Cancel(requestData: any) {
    const body: any = {
      'soapenv:Body': {
        PNR_Cancel: {},
      },
    };

    // Add pnrActions
    if (requestData.pnrActions) {
      Object.assign(
        body['soapenv:Body']['PNR_Cancel'],
        this.createPnrActions(requestData.pnrActions),
      );
    }

    // Add cancelElements
    if (requestData.cancelElements) {
      Object.assign(body['soapenv:Body']['PNR_Cancel'], {
        ...this.createCancelElements(requestData.cancelElements.entryType),
      });
    }

    return body;
  }
}
