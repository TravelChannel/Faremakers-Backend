import { Injectable } from '@nestjs/common';
import { create } from 'xmlbuilder2';

@Injectable()
export class FopCreateFormOfPaymentUtil {
  createTransactionContext(code: string) {
    return {
      transactionContext: {
        transactionDetails: {
          code: code,
        },
      },
    };
  }

  createFopGroup(fopGroupData: any) {
    return {
      fopGroup: {
        fopReference: fopGroupData.fopReference || '',
        mopDescription: {
          fopSequenceNumber: {
            sequenceDetails: {
              number:
                fopGroupData.mopDescription.fopSequenceNumber.sequenceDetails
                  .number,
            },
          },
          mopDetails: {
            fopPNRDetails: {
              fopDetails: {
                fopCode:
                  fopGroupData.mopDetails.fopPNRDetails.fopDetails.fopCode,
              },
            },
          },
          paymentModule: {
            groupUsage: {
              attributeDetails: {
                attributeType:
                  fopGroupData.paymentModule.groupUsage.attributeDetails
                    .attributeType,
              },
            },
            paymentData: {
              merchantInformation: {
                companyCode:
                  fopGroupData.paymentModule.paymentData.merchantInformation
                    .companyCode,
              },
            },
            mopInformation: {
              fopInformation: {
                formOfPayment: {
                  type: fopGroupData.paymentModule.mopInformation.fopInformation
                    .formOfPayment.type,
                },
              },
              dummy: {},
              creditCardData: {
                creditCardDetails: {
                  ccInfo: {
                    vendorCode:
                      fopGroupData.paymentModule.mopInformation.creditCardData
                        .creditCardDetails.ccInfo.vendorCode,
                    cardNumber:
                      fopGroupData.paymentModule.mopInformation.creditCardData
                        .creditCardDetails.ccInfo.cardNumber,
                    securityId:
                      fopGroupData.paymentModule.mopInformation.creditCardData
                        .creditCardDetails.ccInfo.securityId,
                    expiryDate:
                      fopGroupData.paymentModule.mopInformation.creditCardData
                        .creditCardDetails.ccInfo.expiryDate,
                  },
                },
              },
            },
            dummy: {},
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

  createFOPCreateFormOfPayment(requestData: any) {
    const body: any = {
      FOP_CreateFormOfPayment: {},
    };

    // Add transactionContext
    if (requestData.transactionContext) {
      Object.assign(
        body['FOP_CreateFormOfPayment'],
        this.createTransactionContext(requestData.transactionContext.code),
      );
    }

    // Add fopGroup
    if (requestData.fopGroup) {
      Object.assign(body['FOP_CreateFormOfPayment'], {
        fopGroup: this.createFopGroup(requestData.fopGroup),
      });
    }

    return body;
  }
}
