// src/common/utils/soap-header.util.ts
import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
const crypto = require('crypto');
const xml2js = require('xml2js');

@Injectable()
export class SoapHeaderLiveUtil {
  // Function to generate the SHA-1 digest
  private sha1Hash(data: string | Buffer): Buffer {
    return crypto.createHash('sha1').update(data).digest();
  }

  // Function to generate the nonce-based password digest
  private generatePasswordDigest(
    nonce: string,
    created: string,
    password: string,
  ): string {
    // SHA-1 (password)
    const sha1Password = this.sha1Hash(password);

    // Decode nonce from Base64
    const nonceDecoded = Buffer.from(nonce, 'base64');

    // Convert created timestamp to a byte array
    const createdBytes = Buffer.from(created, 'utf8');

    // Combine nonce + created + SHA-1(password)
    const combined = Buffer.concat([nonceDecoded, createdBytes, sha1Password]);

    // SHA-1(nonce + created + SHA-1(password))
    const digest = this.sha1Hash(combined);

    // Encode final digest in Base64
    return digest.toString('base64');
  }

  // Step 1: Generate a random nonce (16 bytes in this case, can vary)
  private generateNonce(): string {
    const nonceBytes = crypto.randomBytes(16); // Generates 16 random bytes
    const nonceBase64 = nonceBytes.toString('base64'); // Convert to Base64
    return nonceBase64;
  }

  // Function to create the current timestamp in UTC format
  private getCreatedTimestamp(): string {
    return new Date().toISOString();
  }

  public createSOAPEnvelopeHeader_bk(type: string): object {
    // Generate nonce, created timestamp, and password digest
    const nonce = this.generateNonce();
    const created = this.getCreatedTimestamp();
    const passwordDigest = this.generatePasswordDigest(
      nonce,
      created,
      process.env.PROD_AMADEUS_PASSWORDTEXT || '',
    );

    let action = '';
    if (type === 'master_price_travelboard') {
      action = 'http://webservices.amadeus.com/FMPTBQ_24_1_1A';
    } else if (type === 'master_price_calender') {
      action = 'http://webservices.amadeus.com/FMPCAQ_20_2_1A';
    } else if (type === 'fare_informative_best_pricing') {
      action = 'http://webservices.amadeus.com/TIBNRQ_23_1_1A';
    }

    const header = {
      'soapenv:Envelope': {
        '@xmlns:soapenv': 'http://schemas.xmlsoap.org/soap/envelope/',
        '@xmlns:add': 'http://www.w3.org/2005/08/addressing',
        '@xmlns:oas':
          'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd',
        '@xmlns:oas1':
          'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd',
        '@xmlns:sec': 'http://xml.amadeus.com/2010/06/Security_v1',
        'soapenv:Header': {
          'add:MessageID': uuidv4(),
          'add:Action': action,
          'add:To': 'https://nodeD2.test.webservices.amadeus.com/1ASIWWWW99T',
          'oas:Security': {
            'oas:UsernameToken': {
              '@oas1:Id': 'UsernameToken-1',
              'oas:Username': process.env.AMADEUS_USER_ID,
              'oas:Nonce': {
                '@EncodingType':
                  'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Base64Binary',
                '#text': nonce,
              },
              'oas:Password': {
                '@Type':
                  'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordDigest',
                '#text': passwordDigest,
              },
              'oas1:Created': created,
            },
          },
          AMA_SecurityHostedUser: {
            '@xmlns': 'http://xml.amadeus.com/2010/06/Security_v1',
            UserID: {
              '@POS_Type': '1',
              '@PseudoCityCode': process.env.AMADEUS_OFFICE_ID,
              '@AgentDutyCode': 'SU',
              '@RequestorType': 'U',
            },
          },
        },
      },
    };

    // Add TransactionFlowLink node for 'fare_informative_best_pricing'
    if (type === 'fare_informative_best_pricing') {
      header['soapenv:Envelope']['soapenv:Header']['link:TransactionFlowLink'] =
      {
        '@xmlns:link': 'http://wsdl.amadeus.com/2010/06/ws/Link_v1',
        'link:Consumer': {
          'link:UniqueID': uuidv4(), // Replace with the required UniqueID
        },
      };
    }

    return header;
  }

  public createSOAPEnvelopeHeader(type: string): object {
    // Generate nonce, created timestamp, and password digest
    const nonce = this.generateNonce();
    const created = this.getCreatedTimestamp();
    const passwordDigest = this.generatePasswordDigest(
      nonce,
      created,
      process.env.PROD_AMADEUS_PASSWORDTEXT || '',
    );

    let action = '';
    if (type === 'master_price_travelboard') {
      action = 'http://webservices.amadeus.com/FMPTBQ_24_1_1A';
    } else if (type === 'master_price_calender') {
      action = 'http://webservices.amadeus.com/FMPCAQ_20_2_1A';
    } else if (type === 'fare_informative_best_pricing') {
      action = 'http://webservices.amadeus.com/TIBNRQ_23_1_1A';
    } else if (type === 'command_cryptic') {
      action = 'http://webservices.amadeus.com/HSFREQ_07_3_1A';
    }

    const header: any = {
      'soapenv:Envelope': {
        '@xmlns:soapenv': 'http://schemas.xmlsoap.org/soap/envelope/',
        '@xmlns:add': 'http://www.w3.org/2005/08/addressing',
        '@xmlns:oas':
          'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd',
        '@xmlns:oas1':
          'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd',
        '@xmlns:sec': 'http://xml.amadeus.com/2010/06/Security_v1',
        'soapenv:Header': {
          'add:MessageID': uuidv4(),
          'add:Action': action,
          'add:To':
            'https://nodeD2.production.webservices.amadeus.com/1ASIWWWW99T',
        },
      },
    };

    // Add TransactionFlowLink node directly below "To" node
    if (
      type === 'fare_informative_best_pricing' ||
      type === 'command_cryptic'
    ) {
      header['soapenv:Envelope']['soapenv:Header']['link:TransactionFlowLink'] =
      {
        '@xmlns:link': 'http://wsdl.amadeus.com/2010/06/ws/Link_v1',
        'link:Consumer': {
          'link:UniqueID': uuidv4(), // Replace this ID dynamically if necessary
        },
      };
    }

    // Add Security details and AMA_SecurityHostedUser
    header['soapenv:Envelope']['soapenv:Header']['oas:Security'] = {
      'oas:UsernameToken': {
        '@oas1:Id': 'UsernameToken-1',
        'oas:Username': process.env.AMADEUS_USER_ID,
        'oas:Nonce': {
          '@EncodingType':
            'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Base64Binary',
          '#text': nonce,
        },
        'oas:Password': {
          '@Type':
            'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordDigest',
          '#text': passwordDigest,
        },
        'oas1:Created': created,
      },
    };

    header['soapenv:Envelope']['soapenv:Header']['AMA_SecurityHostedUser'] = {
      '@xmlns': 'http://xml.amadeus.com/2010/06/Security_v1',
      UserID: {
        '@POS_Type': '1',
        '@PseudoCityCode': process.env.AMADEUS_OFFICE_ID,
        '@AgentDutyCode': 'SU',
        '@RequestorType': 'U',
      },
    };

    return header;
  }

  public createSOAPEnvelopeHeaderSession(
    requestData: any,
    type: string,
  ): object {
    // Generate nonce, created timestamp, and password digest
    const nonce = this.generateNonce();
    const created = this.getCreatedTimestamp();
    const passwordDigest = this.generatePasswordDigest(
      nonce,
      created,
      process.env.PROD_AMADEUS_PASSWORDTEXT || '',
    );

    let action = '';
    if (type === 'master_price_travelboard') {
      action = 'http://webservices.amadeus.com/FMPTBQ_24_1_1A';
    } else if (type === 'master_price_calender') {
      action = 'http://webservices.amadeus.com/FMPCAQ_20_2_1A';
    } else if (type === 'fare_informative_best_pricing') {
      action = 'http://webservices.amadeus.com/TIBNRQ_23_1_1A';
    } else if (type === 'command_cryptic') {
      action = 'http://webservices.amadeus.com/HSFREQ_07_3_1A';
    } else if (type === 'fare_rulescheck') {
      action = 'http://webservices.amadeus.com/FARQNQ_07_1_1A';
    } else if (type === 'airsell-from-recommendation') {
      action = 'http://webservices.amadeus.com/ITAREQ_05_2_IA';
    } else if (type === 'mini_rules') {
      action = 'http://webservices.amadeus.com/TMRXRQ_23_1_1A';
    } else if (type === 'add-multi-elements') {
      action = 'http://webservices.amadeus.com/PNRADD_21_1_1A';
    } else if (type === 'add-form-of-payment') {
      action = 'http://webservices.amadeus.com/TFOPCQ_19_2_1A';
    } else if (type === 'fare_price_pnrwithbookingclass') {
      action = 'http://webservices.amadeus.com/TPCBRQ_23_2_1A';
    } else if (type === 'ticket_create_tst_frompricing') {
      action = 'http://webservices.amadeus.com/TAUTCQ_04_1_1A';
    } else if (type === 'doc_issuance_issuceticket') {
      action = 'http://webservices.amadeus.com/TTKTIQ_15_1_1A';
    } else if (type === 'end_session') {
      action = 'http://webservices.amadeus.com/VLSSOQ_04_1_1A';
    } else if (type === 'retrive_pnr') {
      action = 'http://webservices.amadeus.com/PNRRET_21_1_1A';
    } else if (type === 'pnr_cancel') {
      action = 'http://webservices.amadeus.com/PNRXCL_21_1_1A';
    } else if (type === 'queue_place_pnr') {
      action = 'http://webservices.amadeus.com/QUQPCQ_03_1_1A';
    }

    const header_bk: any = {
      'soapenv:Envelope': {
        '@xmlns:soapenv': 'http://schemas.xmlsoap.org/soap/envelope/',
        '@xmlns:sec': 'http://xml.amadeus.com/2010/06/Security_v1',
        '@xmlns:typ': 'http://xml.amadeus.com/2010/06/Types_v1',
        '@xmlns:app': 'http://xml.amadeus.com/2010/06/AppMdw_CommonTypes_v3',
        '@xmlns:ses': 'http://xml.amadeus.com/2010/06/Session_v3',
        'soapenv:Header': {
          '@xmlns:add': 'http://www.w3.org/2005/08/addressing',
          'add:MessageID': uuidv4(),
          'add:Action': action,
          'add:To': 'https://nodeD2.test.webservices.amadeus.com/1ASIWWWW99T',
        },
      },
    };

    const header: any = {
      'soapenv:Envelope': {
        '@xmlns:soapenv': 'http://schemas.xmlsoap.org/soap/envelope/',
        '@xmlns:add': 'http://www.w3.org/2005/08/addressing',
        '@xmlns:oas':
          'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd',
        '@xmlns:oas1':
          'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd',
        '@xmlns:sec': 'http://xml.amadeus.com/2010/06/Security_v1',
        'soapenv:Header': {
          'add:MessageID': uuidv4(),
          'add:Action': action,
          'add:To':
            'https://nodeD2.production.webservices.amadeus.com/1ASIWWWW99T',
        },
      },
    };

    // Add TransactionFlowLink node directly below "To" node
    if (
      type === 'fare_informative_best_pricing' ||
      type === 'command_cryptic' ||
      type === 'airsell-from-recommendation' ||
      type === 'end_session'
    ) {
      header['soapenv:Envelope']['soapenv:Header']['link:TransactionFlowLink'] =
      {
        '@xmlns:link': 'http://wsdl.amadeus.com/2010/06/ws/Link_v1',
        'link:Consumer': {
          'link:UniqueID': uuidv4(), // Replace this ID dynamically if necessary
        },
      };
    }

    // Add Session node based on TransactionStatusCode
    const { TransactionStatusCode, SessionId, SequenceNumber, SecurityToken } =
      requestData.session;

    if (TransactionStatusCode === 'Start') {
      header['soapenv:Envelope']['soapenv:Header']['awsse:Session'] = {
        '@xmlns:awsse': 'http://xml.amadeus.com/2010/06/Session_v3',
        '@TransactionStatusCode': TransactionStatusCode,
      };
    }

    if (['InSeries', 'End'].includes(TransactionStatusCode)) {
      header['soapenv:Envelope']['soapenv:Header']['awsse:Session'] = {
        '@xmlns:awsse': 'http://xml.amadeus.com/2010/06/Session_v3',
        '@TransactionStatusCode': TransactionStatusCode,
        'awsse:SessionId': SessionId,
        'awsse:SequenceNumber': SequenceNumber,
        'awsse:SecurityToken': SecurityToken,
      };
    }

    if (
      TransactionStatusCode !== 'InSeries' &&
      TransactionStatusCode !== 'End'
    ) {
      // Add Security details and AMA_SecurityHostedUser
      header['soapenv:Envelope']['soapenv:Header']['oas:Security'] = {
        'oas:UsernameToken': {
          '@oas1:Id': 'UsernameToken-1',
          'oas:Username': process.env.AMADEUS_USER_ID,
          'oas:Nonce': {
            '@EncodingType':
              'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Base64Binary',
            '#text': nonce,
          },
          'oas:Password': {
            '@Type':
              'http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordDigest',
            '#text': passwordDigest,
          },
          'oas1:Created': created,
        },
      };

      header['soapenv:Envelope']['soapenv:Header']['AMA_SecurityHostedUser'] = {
        '@xmlns': 'http://xml.amadeus.com/2010/06/Security_v1',
        UserID: {
          '@POS_Type': '1',
          '@PseudoCityCode': requestData.session.office_id || process.env.AMADEUS_OFFICE_ID,
          '@AgentDutyCode': 'SU',
          '@RequestorType': 'U',
        },
      };
    }

    return header;
  }

  public convertXmlToJson(xml) {
    return new Promise((resolve, reject) => {
      xml2js.parseString(xml, { explicitArray: false }, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }
}
