import { Injectable } from '@nestjs/common';
import { create } from 'xmlbuilder2';
import { SoapHeaderUtil } from 'src/common/utility/amadeus/soap-header.util';
import { MasterPriceTravelBoardUtil } from 'src/common/utility/amadeus/mp-travelboard.util';
const crypto = require('crypto');
require('dotenv').config();
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

@Injectable()
export class MasterPriceService {
  constructor(
    private readonly soapHeaderUtil: SoapHeaderUtil,
    private readonly masterPriceTravelBoardUtil: MasterPriceTravelBoardUtil,
  ) {}

  public buildSOAPEnvelope(requestData: any) {
    const soapEnvelope = this.soapHeaderUtil.createSOAPEnvelopeHeader();

    Object.assign(
      soapEnvelope['soapenv:Envelope'],
      this.masterPriceTravelBoardUtil.createSOAPEnvelopeBody(requestData),
    );
    // Convert to XML string
    return create(soapEnvelope).end({ prettyPrint: true });
  }

  public async callMasterPriceTravelBoard(requestData: any) {
    let soapEnvelope = this.soapHeaderUtil.createSOAPEnvelopeHeader();

    Object.assign(
      soapEnvelope['soapenv:Envelope'],
      this.masterPriceTravelBoardUtil.createSOAPEnvelopeBody(requestData),
    );

    const headers = {
      'Content-Type': 'text/xml',
      SOAPAction: 'http://webservices.amadeus.com/FMPTBQ_24_1_1A', // Customize based on API requirements
    };
    let xmlreq = create(soapEnvelope).end({ prettyPrint: true });
    console.log(xmlreq);
    try {
      // Make the API call
      const response = await axios.post(process.env.AMADEUS_ENDPOINT, xmlreq, {
        headers,
      });
      return this.soapHeaderUtil.convertXmlToJson(response.data); // Return the data from the API response
    } catch (error) {
      throw new Error(`Failed to fetch data: ${error.message}`);
    }
  }
}