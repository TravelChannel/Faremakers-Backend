import { Injectable } from '@nestjs/common';
import { create } from 'xmlbuilder2';

@Injectable()
export class MasterPricerCalendarUtil {
  createNumberOfUnit(numberOfUnitArray: { number: number; type: string }[]) {
    return {
      numberOfUnit: {
        unitNumberDetail: numberOfUnitArray.map((unit) => ({
          numberOfUnits: unit.number,
          typeOfUnit: unit.type,
        })),
      },
    };
  }

  createPaxReferences(paxReferences: { ptc: string; travellers: any[] }[]) {
    return paxReferences.map((pax) => ({
      paxReference: {
        ptc: pax.ptc,
        traveller: pax.travellers.map((traveller) => ({
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

  createItineraries(
    itineraries: {
      segRef: string;
      departureId: string;
      arrivalId: string;
      date: string;
      rangeQualifier?: string;
      dayInterval?: number;
    }[],
  ) {
    return itineraries.map((itinerary) => ({
      itinerary: {
        requestedSegmentRef: { segRef: itinerary.segRef },
        departureLocalization: {
          departurePoint: { locationId: itinerary.departureId },
        },
        arrivalLocalization: {
          arrivalPointDetails: { locationId: itinerary.arrivalId },
        },
        timeDetails: {
          firstDateTimeDetail: { date: itinerary.date },
          ...(itinerary.rangeQualifier && itinerary.dayInterval
            ? {
                rangeOfDate: {
                  rangeQualifier: itinerary.rangeQualifier,
                  dayInterval: itinerary.dayInterval,
                },
              }
            : {}),
        },
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
        Fare_MasterPricerCalendar: {},
      },
    };

    // Add numberOfUnit section
    if (requestData.numberOfUnit) {
      Object.assign(
        body['soapenv:Body']['Fare_MasterPricerCalendar'],
        this.createNumberOfUnit(requestData.numberOfUnit),
      );
    }

    // Add paxReferences section
    if (requestData.paxReferences) {
      const paxRefs = this.createPaxReferences(requestData.paxReferences);
      paxRefs.forEach((paxRef) => {
        Object.assign(
          body['soapenv:Body']['Fare_MasterPricerCalendar'],
          paxRef,
        );
      });
    }

    // Add fareOptions section
    if (requestData.fareOptions) {
      Object.assign(
        body['soapenv:Body']['Fare_MasterPricerCalendar'],
        this.createFareOptions(
          requestData.fareOptions.priceTypes,
          requestData.fareOptions.currency,
        ),
      );
    }

    // Add itineraries section
    if (requestData.itineraries) {
      const itineraries = this.createItineraries(requestData.itineraries);
      itineraries.forEach((itinerary) => {
        Object.assign(
          body['soapenv:Body']['Fare_MasterPricerCalendar'],
          itinerary,
        );
      });
    }

    return body;
  }
}
