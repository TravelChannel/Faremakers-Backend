import { Injectable } from '@nestjs/common';
import { create } from 'xmlbuilder2';

@Injectable()
export class PnrRetrieveUtil {
  /**
   * Method to create the PNR_Retrieve structure.
   * @param controlNumber The control number of the reservation to retrieve.
   * @returns The PNR_Retrieve object.
   */
  createPnrRetrieve(controlNumber: string) {
    
    return {
      PNR_Retrieve: {
        retrievalFacts: {
          retrieve: {
            type: '2', // Fixed type as per the provided XML structure
          },
          reservationOrProfileIdentifier: {
            reservation: {
              controlNumber: controlNumber, // Dynamic control number
            },
          },
        },
      },
    };
  }

  /**
   * Method to convert the JSON request into XML.
   * @param object The object to convert.
   * @returns The XML string.
   */
  convertToXML(object: any) {
    return create({ version: '1.0', encoding: 'UTF-8' })
      .ele(object)
      .end({ prettyPrint: true });
  }

  /**
   * Method to create the full XML request for PNR_Retrieve.
   * @param controlNumber The control number of the reservation.
   * @returns The XML string.
   */
  createPnrRetrieveRequest(controlNumber: string) {
    const requestObject = this.createPnrRetrieve(controlNumber);
    return this.convertToXML(requestObject);
  }
}
