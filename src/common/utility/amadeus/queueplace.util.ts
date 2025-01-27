import { Injectable } from '@nestjs/common';
import { create } from 'xmlbuilder2';

@Injectable()
export class QueuePlacePnrUtil {
  createDeliveringSystem(companyId: string) {
    return {
      deliveringSystem: {
        companyId,
      },
    };
  }

  createOriginIdentification(inHouseIdentification1: string) {
    return {
      originIdentification: {
        inHouseIdentification1,
      },
    };
  }

  createPlacementOption(option: string) {
    return {
      placementOption: {
        selectionDetails: {
          option,
        },
      },
    };
  }

  createTargetOffice(sourceQualifier1: string, inHouseIdentification1: string) {
    return {
      targetOffice: {
        sourceType: {
          sourceQualifier1,
        },
        originatorDetails: {
          inHouseIdentification1,
        },
      },
    };
  }

  createQueueDetails(number: number) {
    return {
      queueNumber: {
        queueDetails: {
          number,
        },
      },
    };
  }

  createCategoryDetails(identificationType: string, itemNumber: number) {
    return {
      categoryDetails: {
        subQueueInfoDetails: {
          identificationType,
          itemNumber,
        },
      },
    };
  }

  createPlacementDate(timeMode: number) {
    return {
      placementDate: {
        timeMode,
      },
    };
  }

  createRecordLocator(controlNumber: string) {
    return {
      recordLocator: {
        reservation: {
          controlNumber,
        },
      },
    };
  }

  createSOAPEnvelopeBody(requestData: any) {
    const body: any = {
      'soapenv:Body': {
        Queue_PlacePNR: {},
      },
    };

    // Add originatorOfRequest section
    if (requestData.originatorOfRequest) {
      body['soapenv:Body']['Queue_PlacePNR']['originatorOfRequest'] = {
        ...this.createDeliveringSystem(
          requestData.originatorOfRequest.deliveringSystem.companyId,
        ),
        ...this.createOriginIdentification(
          requestData.originatorOfRequest.originIdentification
            .inHouseIdentification1,
        ),
        originator: requestData.originatorOfRequest.originator,
      };
    }

    // Add placementOption section
    if (requestData.placementOption) {
      Object.assign(
        body['soapenv:Body']['Queue_PlacePNR'],
        this.createPlacementOption(
          requestData.placementOption.selectionDetails.option,
        ),
      );
    }

    // Add targetDetails section
    if (requestData.targetDetails) {
      body['soapenv:Body']['Queue_PlacePNR']['targetDetails'] = {
        ...this.createTargetOffice(
          requestData.targetDetails.targetOffice.sourceType.sourceQualifier1,
          requestData.targetDetails.targetOffice.originatorDetails
            .inHouseIdentification1,
        ),
        ...this.createQueueDetails(
          requestData.targetDetails.queueNumber.queueDetails.number,
        ),
        ...this.createCategoryDetails(
          requestData.targetDetails.categoryDetails.subQueueInfoDetails
            .identificationType,
          requestData.targetDetails.categoryDetails.subQueueInfoDetails
            .itemNumber,
        ),
        ...this.createPlacementDate(
          requestData.targetDetails.placementDate.timeMode,
        ),
      };
    }

    // Add recordLocator section
    if (requestData.recordLocator) {
      Object.assign(
        body['soapenv:Body']['Queue_PlacePNR'],
        this.createRecordLocator(
          requestData.recordLocator.reservation.controlNumber,
        ),
      );
    }

    return body;
  }

  convertToXML(object: any) {
    return create({ version: '1.0', encoding: 'UTF-8' })
      .ele(object)
      .end({ prettyPrint: true });
  }
}
