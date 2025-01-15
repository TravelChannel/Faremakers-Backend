import { Injectable } from '@nestjs/common';
import { create } from 'xmlbuilder2';

@Injectable()
export class FopCreateFormOfPaymentUtil {
  // Create the transaction context for the request
  createTransactionContext(code: string) {
    return {
      transactionContext: {
        transactionDetails: {
          code: code || '',
        },
      },
    };
  }

  // Create FOP Group for each passenger (fopGroupData contains data for a single passenger)
  createFopGroup(fopGroupData: any) {
    return {
      fopReference: fopGroupData.fopReference || '', // Pull fopReference from JSON or default to null
      mopDescription: {
        fopSequenceNumber: {
          sequenceDetails: {
            number:
              fopGroupData.mopDescription.fopSequenceNumber?.sequenceDetails
                ?.number || '1', // Default to '1' if not available
          },
        },
        mopDetails: {
          fopPNRDetails: {
            fopDetails: {
              fopCode:
                fopGroupData.mopDescription.mopDetails.fopPNRDetails?.fopDetails
                  ?.fopCode || 'CASH', // Default to 'CASH' if not present
            },
          },
        },
      },
    };
  }

  // Convert the JavaScript object to XML
  convertToXML(object: any) {
    return create({ version: '1.0', encoding: 'UTF-8' })
      .ele(object)
      .end({ prettyPrint: true });
  }

  // Create the FOP_CreateFormOfPayment body using the provided request data
  createFOPCreateFormOfPayment(requestData: any) {
    const body: any = {
      'soapenv:Body': {
        FOP_CreateFormOfPayment: {
          transactionContext: {},
          fopGroup: [],
        },
      },
      session: {},
    };

    // Add the transaction context if provided
    if (requestData.transactionContext) {
      body['soapenv:Body']['FOP_CreateFormOfPayment'].transactionContext =
        this.createTransactionContext(
          requestData.transactionContext.transactionDetails.code,
        ).transactionContext;
    }

    // Add the fopGroup for each passenger in the request
    if (requestData.fopGroup) {
      body['soapenv:Body']['FOP_CreateFormOfPayment'].fopGroup =
        requestData.fopGroup.map((fopGroupData: any) =>
          this.createFopGroup(fopGroupData),
        );
    }

    // Add the session information
    if (requestData.session) {
      body.session = {
        TransactionStatusCode: requestData.session.TransactionStatusCode || '',
        SessionId: requestData.session.SessionId || '',
        SequenceNumber: requestData.session.SequenceNumber || '',
        SecurityToken: requestData.session.SecurityToken || '',
      };
    }

    return body;
  }
}
