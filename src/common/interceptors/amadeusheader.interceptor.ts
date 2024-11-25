import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as crypto from 'crypto';

@Injectable()
export class SoapHeaderInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    // Generate security values for SOAP header
    const messageID = this.generateMessageID();
    const nonce = this.generateNonce();
    const created = new Date().toISOString();
    const passwordDigest = this.generatePasswordDigest(
      nonce,
      created,
      process.env.AMADEUS_PASSWORD,
    );

    // Create SOAP envelope header
    const soapHeader = this.createSOAPEnvelopeHeader(
      messageID,
      nonce,
      passwordDigest,
      created,
    );

    // Add the SOAP header to the request
    request.headers['soap-header'] = soapHeader;

    return next.handle().pipe(
      tap(() => {
        // You can also modify the response headers here if needed
      }),
    );
  }

  private generateMessageID(): string {
    // Generates a unique MessageID
    return 'urn:uuid:' + crypto.randomUUID();
  }

  private generateNonce(): string {
    // Generates a secure random nonce in base64 format
    return crypto.randomBytes(16).toString('base64');
  }

  private generatePasswordDigest(
    nonce: string,
    created: string,
    password: string,
  ): string {
    // Generates password digest using SHA-1 as per SOAP security requirements
    const hash = crypto.createHash('sha1');
    hash.update(nonce + created + password);
    return hash.digest('base64');
  }

  private createSOAPEnvelopeHeader(
    messageID: string,
    nonce: string,
    passwordDigest: string,
    created: string,
  ) {
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
          'add:MessageID': messageID,
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
}
