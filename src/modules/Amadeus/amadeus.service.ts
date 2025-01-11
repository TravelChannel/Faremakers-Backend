import { Injectable } from '@nestjs/common';
import { create } from 'xmlbuilder2';
import { SoapHeaderUtil } from 'src/common/utility/amadeus/soap-header.util';
import { MasterPriceTravelBoardUtil } from 'src/common/utility/amadeus/mp-travelboard.util';
const crypto = require('crypto');
require('dotenv').config();
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { MasterPricerCalendarUtil } from 'src/common/utility/amadeus/mp-calender.util';
import { AirSellRecommendationUtil } from 'src/common/utility/amadeus/airsell-from-recommendation.util';
import { FareInformativeBestPricingUtil } from 'src/common/utility/amadeus/fare_informative_bestpricing.util';
import { CommandCrypticUtil } from 'src/common/utility/amadeus/command-cryptic.util';
import { FareCheckRulesUtil } from 'src/common/utility/amadeus/fare-checkrules.util';
import { MiniRuleUtil } from 'src/common/utility/amadeus/mini-rules.util';
import { PnrAddMultiElementsUtil } from 'src/common/utility/amadeus/pnr-add-multielements.util';
import { FopCreateFormOfPaymentUtil } from 'src/common/utility/amadeus/fop-createform-of-payment.util';
import { FarePricePNRWithBookingClassUtil } from 'src/common/utility/amadeus/fare-price-pnrwithbookingclass.util';
import { TicketCreateTSTFromPricingUtil } from 'src/common/utility/amadeus/ticket-create-tst-frompricing.util';
import { DocIssuanceIssueTicketUtil } from 'src/common/utility/amadeus/doc-issuance-issuceticket.util';

@Injectable()
export class AmadeusService {
  constructor(
    private readonly soapHeaderUtil: SoapHeaderUtil,
    private readonly masterPriceTravelBoardUtil: MasterPriceTravelBoardUtil,
    private readonly masterPriceTravelCalender: MasterPricerCalendarUtil,
    private readonly fareinformativeBestPricing: FareInformativeBestPricingUtil,
    private readonly farecheckrules: FareCheckRulesUtil,
    private readonly commandCryptic: CommandCrypticUtil,
    private readonly miniRules: MiniRuleUtil,
    private readonly airsellFromRecommendation: AirSellRecommendationUtil,
    private readonly pnrAddMultiElements: PnrAddMultiElementsUtil,
    private readonly fopCreateFormOfPayment: FopCreateFormOfPaymentUtil,
    private readonly fare_price_pnrwithbookingclass: FarePricePNRWithBookingClassUtil,
    private readonly ticketCreateTSTFromPricing: TicketCreateTSTFromPricingUtil,
    private readonly docIssuanceIssueTicket: DocIssuanceIssueTicketUtil,
  ) {}

  public async callCommandCryptic(requestData: any) {
    let soapEnvelope = this.soapHeaderUtil.createSOAPEnvelopeHeaderSession(
      requestData,
      'command_cryptic',
    );

    Object.assign(
      soapEnvelope['soapenv:Envelope'],
      this.commandCryptic.createSOAPEnvelopeBody(requestData),
    );

    const headers = {
      'Content-Type': 'text/xml',
      SOAPAction: 'http://webservices.amadeus.com/HSFREQ_07_3_1A', // Customize based on API requirements
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
      throw new Error(`Failed to fetch data: ${error.response.data}`);
    }
  }

  public async callMasterPriceTravelBoard(requestData: any) {
    let soapEnvelope = this.soapHeaderUtil.createSOAPEnvelopeHeader(
      'master_price_travelboard',
    );

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
      throw new Error(`Failed to fetch data: ${error.response.data}`);
    }
  }

  public async callMasterPriceCalender(requestData: any) {
    let soapEnvelope = this.soapHeaderUtil.createSOAPEnvelopeHeader(
      'master_price_calender',
    );

    Object.assign(
      soapEnvelope['soapenv:Envelope'],
      this.masterPriceTravelCalender.createSOAPEnvelopeBody(requestData),
    );

    const headers = {
      'Content-Type': 'text/xml',
      SOAPAction: 'http://webservices.amadeus.com/FMPCAQ_20_2_1A', // Customize based on API requirements
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
      throw new Error(`Failed to fetch data: ${error.response.data}`);
    }
  }

  public async callFareinformativeBestPricing(requestData: any) {
    let soapEnvelope = this.soapHeaderUtil.createSOAPEnvelopeHeaderSession(
      requestData,
      'fare_informative_best_pricing',
    );

    Object.assign(
      soapEnvelope['soapenv:Envelope'],
      this.fareinformativeBestPricing.createFareInformativePricingRequest(
        requestData.Fare_InformativeBestPricingWithoutPNR,
      ),
    );

    const headers = {
      'Content-Type': 'text/xml',
      SOAPAction: 'http://webservices.amadeus.com/TIBNRQ_23_1_1A', // Customize based on API requirements
    };
    let xmlreq = create(soapEnvelope).end({ prettyPrint: true });
    console.log(xmlreq);
    try {
      // Make the API call
      const response = await axios.post(process.env.AMADEUS_ENDPOINT, xmlreq, {
        headers,
      });
      //return response.data;
      return this.soapHeaderUtil.convertXmlToJson(response.data); // Return the data from the API response
    } catch (error) {
      throw new Error(`Failed to fetch data: ${error.response.data}`);
    }
  }

  public async callFareRulesCheck(requestData: any) {
    let soapEnvelope = this.soapHeaderUtil.createSOAPEnvelopeHeaderSession(
      requestData,
      'fare_rulescheck',
    );

    Object.assign(
      soapEnvelope['soapenv:Envelope'],
      this.farecheckrules.createFareCheckRulesRequest(
        requestData.Fare_CheckRules,
      ),
    );

    const headers = {
      'Content-Type': 'text/xml',
      SOAPAction: 'http://webservices.amadeus.com/FARQNQ_07_1_1A', // Customize based on API requirements
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
      throw new Error(`Failed to fetch data: ${error.response.data}`);
    }
  }

  public async callMiniRules(requestData: any) {
    let soapEnvelope = this.soapHeaderUtil.createSOAPEnvelopeHeaderSession(
      requestData,
      'mini_rules',
    );

    Object.assign(
      soapEnvelope['soapenv:Envelope'],
      this.miniRules.createMiniRuleGetFromRecRequest(
        requestData.MiniRule_GetFromRec,
      ),
    );

    const headers = {
      'Content-Type': 'text/xml',
      SOAPAction: 'http://webservices.amadeus.com/TMRXRQ_23_1_1A', // Customize based on API requirements
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
      throw new Error(`Failed to fetch data: ${error.response.data}`);
    }
  }

  public async callAirSellFromRecommedation(requestData: any) {
    let soapEnvelope = this.soapHeaderUtil.createSOAPEnvelopeHeaderSession(
      requestData,
      'airsell-from-recommendation',
    );

    Object.assign(
      soapEnvelope['soapenv:Envelope'],
      this.airsellFromRecommendation.createSOAPEnvelopeBody(
        requestData.Air_SellFromRecommendation,
      ),
    );

    const headers = {
      'Content-Type': 'text/xml',
      SOAPAction: 'http://webservices.amadeus.com/ITAREQ_05_2_IA', // Customize based on API requirements
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
      throw new Error(`Failed to fetch data: ${error.response.data}`);
    }
  }

  public async callAddMultiElements(requestData: any) {
    let soapEnvelope = this.soapHeaderUtil.createSOAPEnvelopeHeaderSession(
      requestData,
      'add-multi-elements',
    );

    Object.assign(
      soapEnvelope['soapenv:Envelope'],
      this.pnrAddMultiElements.createPNRAddMultiElements(
        requestData.PNR_AddMultiElements,
      ),
    );

    const headers = {
      'Content-Type': 'text/xml',
      SOAPAction: 'http://webservices.amadeus.com/PNRADD_21_1_1A', // Customize based on API requirements
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
      throw new Error(`Failed to fetch data: ${error.response.data}`);
    }
  }

  public async callAddFormofPayment(requestData: any) {
    let soapEnvelope = this.soapHeaderUtil.createSOAPEnvelopeHeaderSession(
      requestData,
      'add-form-of-payment',
    );

    Object.assign(
      soapEnvelope['soapenv:Envelope'],
      this.fopCreateFormOfPayment.createFOPCreateFormOfPayment(
        requestData.FOP_CreateFormOfPayment,
      ),
    );

    const headers = {
      'Content-Type': 'text/xml',
      SOAPAction: 'http://webservices.amadeus.com/TFOPCQ_19_2_1A', // Customize based on API requirements
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
      throw new Error(`Failed to fetch data: ${error.response.data}`);
    }
  }

  public async callFarePricePNRWithBookingClass(requestData: any) {
    let soapEnvelope = this.soapHeaderUtil.createSOAPEnvelopeHeaderSession(
      requestData,
      'fare_price_pnrwithbookingclass',
    );

    Object.assign(
      soapEnvelope['soapenv:Envelope'],
      this.fare_price_pnrwithbookingclass.createFarePricePNRWithBookingClass(
        requestData.Fare_PricePNRWithBookingClass,
      ),
    );

    const headers = {
      'Content-Type': 'text/xml',
      SOAPAction: 'http://webservices.amadeus.com/TPCBRQ_23_2_1A', // Customize based on API requirements
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
      throw new Error(`Failed to fetch data: ${error.response.data}`);
    }
  }

  public async callTicketCreateTSTFromPricing(requestData: any) {
    let soapEnvelope = this.soapHeaderUtil.createSOAPEnvelopeHeaderSession(
      requestData,
      'ticket_create_tst_frompricing',
    );

    Object.assign(
      soapEnvelope['soapenv:Envelope'],
      this.ticketCreateTSTFromPricing.createTicketCreateTSTFromPricing(
        requestData.Ticket_CreateTSTFromPricing,
      ),
    );

    const headers = {
      'Content-Type': 'text/xml',
      SOAPAction: 'http://webservices.amadeus.com/TAUTCQ_04_1_1A', // Customize based on API requirements
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
      throw new Error(`Failed to fetch data: ${error.response.data}`);
    }
  }

  public async callDocIssuanceIssueTicket(requestData: any) {
    let soapEnvelope = this.soapHeaderUtil.createSOAPEnvelopeHeaderSession(
      requestData,
      'doc_issuance_issuceticket',
    );

    Object.assign(
      soapEnvelope['soapenv:Envelope'],
      this.docIssuanceIssueTicket.createDocIssuanceIssueTicket(
        requestData.DocIssuance_IssueTicket,
      ),
    );

    const headers = {
      'Content-Type': 'text/xml',
      SOAPAction: 'http://webservices.amadeus.com/TTKTIQ_15_1_1A', // Customize based on API requirements
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
      throw new Error(`Failed to fetch data: ${error.response.data}`);
    }
  }
}
