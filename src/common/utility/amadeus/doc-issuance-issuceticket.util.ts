import { Injectable } from '@nestjs/common';
import { create } from 'xmlbuilder2';

@Injectable()
export class DocIssuanceIssueTicketUtil {
  // Method to create optionGroup object with switches
  createOptionGroup() {
    return {
      optionGroup: {
        switches: {
          statusDetails: {
            indicator: 'ET', // Default to 'ET'
          },
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

  // Method to create the full DocIssuance_IssueTicket request structure
  createDocIssuanceIssueTicket() {
    const body: any = {
      'soapenv:Body': {
        DocIssuance_IssueTicket: this.createOptionGroup(),
      },
    };

    return body;
  }
}
