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

  createFareOptions(priceTypes: string[], currency: string) {
    return {
      fareOptions: {
        pricingTickInfo: {
          pricingTicketing: {
            priceType: priceTypes,
          },
        },
        conversionRate: {
          conversionRateDetail: {
            currency: currency,
          },
        },
      },
    };
  }

  createTravelFlightInfo(cabin, carrierIds) {
    return {
      travelFlightInfo: {
        cabinId: {
          cabin: cabin,
        },
        companyIdentity: {
          carrierQualifier: 'X',
          carrierId: carrierIds,
        },
      },
    };
  }

  createFareFamilies(fareFamilies) {
    return fareFamilies.map((family) => ({
      fareFamilies: {
        familyInformation: {
          refNumber: family.familyInformation.refNumber,
          fareFamilyname: family.familyInformation.fareFamilyname,
          hierarchy: family.familyInformation.hierarchy,
        },
        familyCriteria: {
          carrierId: family.familyCriteria.carrierId,
          cabinProduct: {
            cabinDesignator: family.familyCriteria.cabinProduct.cabinDesignator,
          },
        },
      },
    }));
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

    if (requestData.fareFamilies) {
      const families = this.createFareFamilies(requestData.fareFamilies);
      body['soapenv:Body']['Fare_MasterPricerTravelBoardSearch'][
        'fareFamilies'
      ] = families.map((fam) => fam.fareFamilies);
    }

    if (requestData.fareOptions) {
      Object.assign(
        body['soapenv:Body']['Fare_MasterPricerTravelBoardSearch'],
        this.createFareOptions(
          requestData.fareOptions.priceTypes,
          requestData.fareOptions.currency,
        ),
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
