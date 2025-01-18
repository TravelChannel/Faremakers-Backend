import { Injectable } from '@nestjs/common';

const { create } = require('xmlbuilder2');

@Injectable()
export class MasterPriceTravelBoardUtil {
  createNumberOfUnit(numberOfUnitArray) {
    return {
      numberOfUnit: {
        unitNumberDetail: numberOfUnitArray.map((unit) => ({
          numberOfUnits: unit.number,
          typeOfUnit: unit.type,
        })),
      },
    };
  }

  createPaxReferences(paxReferences: { ptc: string; traveller: any[] }[]) {
    return paxReferences.map((pax) => ({
      paxReference: {
        ptc: pax.ptc,
        traveller: pax.traveller.map((traveller) => ({
          ref: traveller.ref,
          ...(traveller.infantIndicator && {
            infantIndicator: traveller.infantIndicator,
          }),
        })),
      },
    }));
  }

  createFareOptions(priceTypes) {
    return {
      fareOptions: {
        pricingTickInfo: {
          pricingTicketing: {
            priceType: priceTypes.map((type) => type),
          },
        },
      },
    };
  }

  createTravelFlightInfo(cabin, carrierIds) {
    return {
      travelFlightInfo: {
        companyIdentity: {
          carrierQualifier: 'X',
          carrierId: carrierIds,
        },
        flightDetail: {
          flightType: 'N',
        },
      },
    };
  }

  createItinerary(itineraries) {
    return itineraries.map((itinerary, index) => ({
      itinerary: {
        requestedSegmentRef: { segRef: (index + 1).toString() },
        departureLocalization: {
          departurePoint: { locationId: itinerary.departureId },
        },
        arrivalLocalization: {
          arrivalPointDetails: { locationId: itinerary.arrivalId },
        },
        timeDetails: { firstDateTimeDetail: { date: itinerary.date } },
      },
    }));
  }

  convertToXML(object) {
    const xml = create().ele(object).end({ prettyPrint: true });
    return xml;
  }

  createSOAPEnvelopeBody(requestData) {
    const body = {
      'soapenv:Body': {
        Fare_MasterPricerTravelBoardSearch: {},
      },
    };

    if (requestData.numberOfUnit) {
      Object.assign(
        body['soapenv:Body']['Fare_MasterPricerTravelBoardSearch'],
        this.createNumberOfUnit(requestData.numberOfUnit),
      );
    }

    if (requestData.paxReference) {
      const paxRefs = this.createPaxReferences(requestData.paxReference);
      body['soapenv:Body']['Fare_MasterPricerTravelBoardSearch'][
        'paxReference'
      ] = paxRefs.map((paxRef) => paxRef.paxReference);
    }

    if (requestData.fareOptions) {
      Object.assign(
        body['soapenv:Body']['Fare_MasterPricerTravelBoardSearch'],
        this.createFareOptions(requestData.fareOptions.priceTypes),
      );
    }

    if (requestData.travelFlightInfo) {
      Object.assign(
        body['soapenv:Body']['Fare_MasterPricerTravelBoardSearch'],
        this.createTravelFlightInfo(
          requestData.travelFlightInfo.cabin,
          requestData.travelFlightInfo.carrierIds,
        ),
      );
    }

    if (requestData.itinerary) {
      const itineraries = this.createItinerary(requestData.itinerary);
      body['soapenv:Body']['Fare_MasterPricerTravelBoardSearch']['itinerary'] =
        itineraries.map((itinerary) => itinerary.itinerary);
    }

    return body;
  }
}
