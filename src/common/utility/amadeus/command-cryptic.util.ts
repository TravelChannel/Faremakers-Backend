import { Injectable } from '@nestjs/common';
import { create } from 'xmlbuilder2';

@Injectable()
export class CommandCrypticUtil {
  /**
   * Converts a JavaScript object to an XML string.
   */
  convertToXML(object: any) {
    return create({ version: '1.0', encoding: 'UTF-8' })
      .ele(object)
      .end({ prettyPrint: true });
  }

  /**
   * Creates the SOAP envelope body for the Command Cryptic request.
   */
  createSOAPEnvelopeBody(requestData) {
    const body: any = {
      'soapenv:Body': {
        Command_Cryptic: {
          messageAction: {
            messageFunctionDetails: {
              messageFunction:
                requestData.Command_Cryptic.messageAction.messageFunctionDetails
                  .messageFunction,
            },
          },
          longTextString: {
            textStringDetails:
              requestData.Command_Cryptic.longTextString.textStringDetails,
          },
        },
      },
    };

    return body;
  }
}
