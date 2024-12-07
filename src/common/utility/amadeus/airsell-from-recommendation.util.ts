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

  createSegmentInformation(segments: any[]) {
    return segments.map((segment) => ({
      segmentInformation: {
        travelProductInformation: {
          flightDate: { departureDate: segment.departureDate },
          boardPointDetails: { trueLocationId: segment.boardPoint },
          offpointDetails: { trueLocationId: segment.offPoint },
          companyDetails: { marketingCompany: segment.marketingCompany },
          flightIdentification: {
            flightNumber: segment.flightNumber,
            bookingClass: segment.bookingClass,
          },
        },
        relatedproductInformation: {
          quantity: segment.quantity,
          statusCode: segment.statusCode,
        },
      },
    }));
  }

  createItineraryDetails(itineraries: any[]) {
    return itineraries.map((itinerary) => ({
      itineraryDetails: {
        ...this.createOriginDestinationDetails(
          itinerary.origin,
          itinerary.destination,
        ),
        message: {
          messageFunctionDetails: {
            messageFunction: '183',
          },
        },
        segmentInformation: this.createSegmentInformation(itinerary.segments),
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
      'soapenv:Envelope': {
        $: {
          'xmlns:soapenv': 'http://schemas.xmlsoap.org/soap/envelope/',
          'xmlns:ns': 'http://xml.amadeus.com/ASFRBQ_21_1_1A',
        },
        'soapenv:Header': {},
        'soapenv:Body': {
          'ns:Air_SellFromRecommendation': {},
        },
      },
    };

    // Add messageActionDetails section
    if (requestData.messageActionDetails) {
      Object.assign(
        body['soapenv:Body']['ns:Air_SellFromRecommendation'],
        this.createMessageActionDetails(
          requestData.messageActionDetails.messageFunction,
          requestData.messageActionDetails.additionalMessageFunction,
        ),
      );
    }

    // Add itineraryDetails section
    if (requestData.itineraries) {
      const itineraries = this.createItineraryDetails(requestData.itineraries);
      body['soapenv:Body']['ns:Air_SellFromRecommendation'][
        'itineraryDetails'
      ] = itineraries.map((itinerary) => itinerary.itineraryDetails);
    }

    return body;
  }
}
