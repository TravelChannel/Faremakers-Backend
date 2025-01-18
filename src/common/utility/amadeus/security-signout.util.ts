import { Injectable } from '@nestjs/common';
import { create } from 'xmlbuilder2';

@Injectable()
export class SecuritySignOutUtil {
  // Method to create the Security_SignOut structure
  createSecuritySignOut() {
    return {
      Security_SignOut: {},
    };
  }

  // Method to convert the JSON request into XML
  convertToXML(object: any) {
    return create({ version: '1.0', encoding: 'UTF-8' })
      .ele(object)
      .end({ prettyPrint: true });
  }

  // Method to create the full Security_SignOut request structure
  createSecuritySignOutRequest() {
    const body: any = {
      'soapenv:Body': this.createSecuritySignOut(),
    };

    return body;
  }
}
