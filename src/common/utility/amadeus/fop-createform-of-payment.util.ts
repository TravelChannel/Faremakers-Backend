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
      fopGroup: {
        fopReference: fopGroupData.fopReference || null, // Pull fopReference from JSON or default to null
        pnrElementAssociation: {
          referenceDetails: {
            type:
              fopGroupData.pnrElementAssociation.referenceDetails.type || 'PAX', // Default 'PAX' if not present
            value:
              fopGroupData.pnrElementAssociation.referenceDetails.value || '', // Get value from JSON
          },
        },
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
                  fopGroupData.mopDescription.mopDetails.fopPNRDetails
                    ?.fopDetails?.fopCode || 'CASH', // Default to 'CASH' if not present
              },
            },
          },
          paymentModule: {
            groupUsage: {
              attributeDetails: {
                attributeType:
                  fopGroupData.mopDescription.paymentModule?.groupUsage
                    ?.attributeDetails?.attributeType || 'FP', // Default to 'FP'
              },
            },
            paymentData: {
              merchantInformation: {
                companyCode:
                  fopGroupData.mopDescription.paymentModule?.paymentData
                    ?.merchantInformation?.companyCode || '6X', // Default to '6X'
              },
            },
            mopInformation: {
              fopInformation: {
                formOfPayment: {
                  type:
                    fopGroupData.mopDescription.paymentModule?.mopInformation
                      ?.fopInformation?.formOfPayment?.type || 'CASH', // Default to 'CASH'
                },
              },
              dummy:
                fopGroupData.mopDescription.paymentModule?.mopInformation
                  ?.dummy || {}, // Assuming 'dummy' is optional
            },
            dummy: fopGroupData.mopDescription.paymentModule?.dummy || {}, // Assuming 'dummy' is optional
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
        FOP_CreateFormOfPayment: {},
      },
    };

    // Add the transaction context if provided
    if (requestData.transactionContext) {
      Object.assign(
        body['soapenv:Body']['FOP_CreateFormOfPayment'],
        this.createTransactionContext(
          requestData.transactionContext.transactionDetails.code,
        ),
      );
    }

    // Add the fopGroup for each passenger in the request
    if (requestData.fopGroup) {
      body['soapenv:Body']['FOP_CreateFormOfPayment'].fopGroup =
        requestData.fopGroup.map((fopGroupData: any) =>
          this.createFopGroup(fopGroupData),
        );
    }

    return body;
  }
}
