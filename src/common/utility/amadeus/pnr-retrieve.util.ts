import { Injectable } from '@nestjs/common';
import { create } from 'xmlbuilder2';

@Injectable()
export class PnrRetrieveUtil {
  createRetrievalFacts(type: string, controlNumber: string) {
    return {
      PNR_Retrieve: {
        retrievalFacts: {
          retrieve: {
            type: type,
          },
          reservationOrProfileIdentifier: {
            reservation: {
              controlNumber: controlNumber,
            },
          },
        },
      },
    };
  }

  convertToXML(object: any) {
    return create({ version: '1.0', encoding: 'UTF-8' })
      .ele(object)
      .end({ prettyPrint: true });
  }

  createSOAPEnvelopeBody(requestData: any) {
    if (
      !requestData.PNR_Retrieve.retrievalFacts.retrieve.type ||
      !requestData.PNR_Retrieve.retrievalFacts.reservationOrProfileIdentifier
        .reservation.controlNumber
    ) {
      throw new Error('Both type and controlNumber are required');
    }

    const body: any = {
      'soapenv:Body': this.createRetrievalFacts(
        requestData.PNR_Retrieve.retrievalFacts.retrieve.type,
        requestData.PNR_Retrieve.retrievalFacts.reservationOrProfileIdentifier
          .reservation.controlNumber,
      ),
    };

    return body;
  }
}
