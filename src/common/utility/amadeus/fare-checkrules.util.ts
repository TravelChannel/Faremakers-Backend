import { Injectable } from '@nestjs/common';
import { create } from 'xmlbuilder2';

@Injectable()
export class FareCheckRulesUtil {
  createMessageFunctionDetails(messageFunction: string) {
    return {
      messageFunctionDetails: {
        messageFunction,
      },
    };
  }

  createFareRule(ruleSectionIds: string[]) {
    return {
      fareRule: {
        tarifFareRule: {
          ruleSectionId: ruleSectionIds,
        },
      },
    };
  }

  createItemNumberGroup(itemDetails: { number: string; type?: string }[] = []) {
    return {
      itemNumberDetails: itemDetails.map((item) => ({
        number: item.number,
        ...(item.type ? { type: item.type } : {}),
      })),
    };
  }

  createFareCheckRulesRequest(requestData: any) {
    const body: any = {
      'soapenv:Body': {
        Fare_CheckRules: {},
      },
    };

    // Add msgType
    if (requestData.msgType) {
      Object.assign(body['soapenv:Body']['Fare_CheckRules'], {
        msgType: {
          messageFunctionDetails: {
            messageFunction:
              requestData.msgType.messageFunctionDetails.messageFunction,
          },
        },
      });
    }

    // Add itemNumber
    if (requestData.itemNumber) {
      Object.assign(body['soapenv:Body']['Fare_CheckRules'], {
        itemNumber: this.createItemNumberGroup(
          requestData.itemNumber.itemNumberDetails,
        ),
      });
    }

    // Add fareRule
    if (requestData.fareRule) {
      Object.assign(body['soapenv:Body']['Fare_CheckRules'], {
        fareRule: {
          tarifFareRule: {
            ruleSectionId: requestData.fareRule.tarifFareRule.ruleSectionId,
          },
        },
      });
    }

    return body;
  }

  convertToXML(object: any) {
    return create({ version: '1.0', encoding: 'UTF-8' })
      .ele(object)
      .end({ prettyPrint: true });
  }
}
