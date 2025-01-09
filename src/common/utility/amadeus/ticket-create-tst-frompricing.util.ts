import { Injectable } from '@nestjs/common';
import { create } from 'xmlbuilder2';

@Injectable()
export class TicketCreateTSTFromPricingUtil {
  // Method to create psaList object with itemReference
  createPsaList(itemReference: any) {
    return {
      psaList: {
        itemReference: {
          referenceType: itemReference.referenceType || 'TST', // Default to 'TST' if no value is provided
          uniqueReference: itemReference.uniqueReference || '1', // Default to '1' if no value is provided
        },
      },
    };
  }

  // Method to convert the JSON request into XML
  convertToXML(object: any) {
    return create({ version: '1.0', encoding: 'UTF-8' })
      .ele(object)
      .end({ prettyPrint: true });
  }

  // Method to create the full Ticket_CreateTSTFromPricing request structure
  createTicketCreateTSTFromPricing(requestData: any) {
    const body: any = {
      'soapenv:Body': {
        Ticket_CreateTSTFromPricing: {},
      },
    };

    // Add psaList if provided in the requestData
    if (requestData.psaList) {
      Object.assign(
        body['soapenv:Body']['Ticket_CreateTSTFromPricing'],
        this.createPsaList(requestData.psaList),
      );
    }

    return body;
  }
}
