import { Injectable } from '@nestjs/common';
import { create } from 'xmlbuilder2';

@Injectable()
export class AirSellRecommendationUtil {
  createMessageActionDetails(
    messageFunction: string,
    additionalMessageFunction: string,
  ) {
    return {
      messageActionDetails: {
        messageFunctionDetails: {
          messageFunction: messageFunction,
          additionalMessageFunction: additionalMessageFunction,
        },
      },
    };
  }

  createOriginDestinationDetails(origin: string, destination: string) {
    return {
      originDestinationDetails: {
        origin: origin,
        destination: destination,
      },
    };
  }

  createSegmentInformation(segments) {
    return segments.map((segment) => ({
      travelProductInformation: {
        flightDate: {
          departureDate:
            segment.travelProductInformation.flightDate.departureDate,
        },
        boardPointDetails: {
          trueLocationId:
            segment.travelProductInformation.boardPointDetails.trueLocationId,
        },
        offpointDetails: {
          trueLocationId:
            segment.travelProductInformation.offpointDetails.trueLocationId,
        },
        companyDetails: {
          marketingCompany:
            segment.travelProductInformation.companyDetails.marketingCompany,
        },
        flightIdentification: {
          flightNumber:
            segment.travelProductInformation.flightIdentification.flightNumber,
          bookingClass:
            segment.travelProductInformation.flightIdentification.bookingClass,
        },
      },
      relatedproductInformation: {
        quantity: segment.relatedproductInformation.quantity,
        statusCode: segment.relatedproductInformation.statusCode,
      },
    }));
  }

  createItineraryDetails(itineraries: any[]) {
    return itineraries.map((itinerary) => ({
      itineraryDetails: {
        ...this.createOriginDestinationDetails(
          itinerary.originDestinationDetails.origin,
          itinerary.originDestinationDetails.destination,
        ),
        message: {
          messageFunctionDetails: {
            messageFunction: '183',
          },
        },
        segmentInformation: this.createSegmentInformation(
          itinerary.segmentInformation,
        ),
      },
    }));
  }

  convertToXML(object: any) {
    return create({ version: '1.0', encoding: 'UTF-8' })
      .ele(object)
      .end({ prettyPrint: true });
  }

  createSOAPEnvelopeBody(requestData: any) {
    const body: any = {
      'soapenv:Body': {
        Air_SellFromRecommendation: {},
      },
    };

    // Add messageActionDetails section
    if (requestData.messageActionDetails) {
      Object.assign(
        body['soapenv:Body']['Air_SellFromRecommendation'],
        this.createMessageActionDetails(
          requestData.messageActionDetails.messageFunctionDetails
            .messageFunction,
          requestData.messageActionDetails.messageFunctionDetails
            .additionalMessageFunction,
        ),
      );
    }

    // Add itineraryDetails section
    if (requestData.itineraryDetails) {
      const itineraries = this.createItineraryDetails(
        requestData.itineraryDetails,
      );
      body['soapenv:Body']['Air_SellFromRecommendation'] = itineraries;
    }

    return body;
  }
}
