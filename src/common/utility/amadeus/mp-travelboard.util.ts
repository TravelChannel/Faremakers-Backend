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

  createPaxReference(ptc, ref) {
    return {
      paxReference: {
        ptc: ptc,
        traveller: { ref: ref },
      },
    };
  }

  createFareOptions(priceTypes) {
    return {
      fareOptions: {
        pricingTickInfo: {
          pricingTicketing: {
            priceType: priceTypes.map((type) => ({ '#text': type })),
          },
        },
      },
    };
  }

  createTravelFlightInfo(cabin, carrierId) {
    return {
      travelFlightInfo: {
        cabinId: { cabin: cabin },
        companyIdentity: {
          carrierQualifier: 'M',
          carrierId: carrierId,
        },
      },
    };
  }

  createItinerary(departureId, arrivalId, date) {
    return {
      itinerary: {
        requestedSegmentRef: { segRef: '1' },
        departureLocalization: { departurePoint: { locationId: departureId } },
        arrivalLocalization: { arrivalPointDetails: { locationId: arrivalId } },
        timeDetails: { firstDateTimeDetail: { date: date } },
      },
    };
  }

  convertToXML(object) {
    // Use `create` to convert the JavaScript object to XML
    const xml = create().ele(object).end({ prettyPrint: true }); // `prettyPrint` for readable XML output

    return xml;
  }

  createSOAPEnvelopeBody(requestData) {
    const body = {
      'soapenv:Body': {
        Fare_MasterPricerTravelBoardSearch: {},
      },
    };

    // Dynamically add sections based on request data
    if (requestData.numberOfUnit) {
      Object.assign(
        body['soapenv:Body']['Fare_MasterPricerTravelBoardSearch'],
        this.createNumberOfUnit(requestData.numberOfUnit),
      );
    }

    if (requestData.paxReference) {
      Object.assign(
        body['soapenv:Body']['Fare_MasterPricerTravelBoardSearch'],
        this.createPaxReference(
          requestData.paxReference.ptc,
          requestData.paxReference.ref,
        ),
      );
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
          requestData.travelFlightInfo.carrierId,
        ),
      );
    }

    if (requestData.itinerary) {
      Object.assign(
        body['soapenv:Body']['Fare_MasterPricerTravelBoardSearch'],
        this.createItinerary(
          requestData.itinerary.departureId,
          requestData.itinerary.arrivalId,
          requestData.itinerary.date,
        ),
      );
    }

    return body;
  }
}
