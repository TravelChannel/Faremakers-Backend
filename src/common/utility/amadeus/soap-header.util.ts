// src/common/utils/soap-header.util.ts
import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
const crypto = require('crypto');
const xml2js = require('xml2js');

@Injectable()
export class SoapHeaderUtil {
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

  public createSOAPEnvelopeHeader(): object {
    // Generate nonce, created timestamp, and password digest
    const nonce = this.generateNonce();
    const created = this.getCreatedTimestamp();
    const passwordDigest = this.generatePasswordDigest(
      nonce,
      created,
      process.env.AMADEUS_PASSWORDTEXT || '',
    );

    return {
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
          'add:Action': 'http://webservices.amadeus.com/FMPTBQ_24_1_1A',
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