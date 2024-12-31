import { Injectable } from '@nestjs/common';
import { create } from 'xmlbuilder2';

@Injectable()
export class FareInformativeBestPricingUtil {
  createSegmentControlDetails(quantity: number, numberOfUnits: number) {
    return {
      segmentControlDetails: {
        quantity,
        numberOfUnits,
      },
    };
  }

  createTravellerDetails(travellers: {
    travellerDetails: { measurementValue: number }[];
  }) {
    return {
      travellersID: {
        travellerDetails: travellers.travellerDetails.map((detail) => ({
          measurementValue: detail.measurementValue,
        })),
      },
    };
  }

  createDiscountPtc(
    valueQualifier: string,
    fareDetails?: { qualifier: string },
  ) {
    const discountPtc = {
      valueQualifier,
    };

    if (fareDetails) {
      Object.assign(discountPtc, { fareDetails });
    }

    return { discountPtc };
  }

  createPassengersGroup(passengers: any[]) {
    return passengers.map((passenger) => ({
      segmentRepetitionControl: this.createSegmentControlDetails(
        passenger.segmentRepetitionControl.segmentControlDetails.quantity,
        passenger.segmentRepetitionControl.segmentControlDetails.numberOfUnits,
      ),
      ...this.createTravellerDetails(passenger.travellersID),
      ...this.createDiscountPtc(
        passenger.discountPtc.valueQualifier,
        passenger.discountPtc.fareDetails,
      ),
    }));
  }

  createSegmentInformation(segment: any) {
    return {
      segmentInformation: {
        flightDate: {
          departureDate: segment.segmentInformation.flightDate.departureDate,
          departureTime: segment.segmentInformation.flightDate.departureTime,
          arrivalDate: segment.segmentInformation.flightDate.arrivalDate,
          arrivalTime: segment.segmentInformation.flightDate.arrivalTime,
        },
        boardPointDetails: {
          trueLocationId:
            segment.segmentInformation.boardPointDetails.trueLocationId,
        },
        offpointDetails: {
          trueLocationId:
            segment.segmentInformation.offpointDetails.trueLocationId,
        },
        companyDetails: {
          marketingCompany:
            segment.segmentInformation.companyDetails.marketingCompany,
        },
        flightIdentification: {
          flightNumber:
            segment.segmentInformation.flightIdentification.flightNumber,
          bookingClass:
            segment.segmentInformation.flightIdentification.bookingClass,
        },
        flightTypeDetails: {
          flightIndicator:
            segment.segmentInformation.flightTypeDetails.flightIndicator,
        },
        itemNumber: segment.segmentInformation.itemNumber,
      },
    };
  }

  createSegmentGroup(segments: any[]) {
    return segments.map((segment) => ({
      segmentGroup: this.createSegmentInformation([segment]),
    }));
  }

  createPricingOptionGroup(pricingOptions: any[]) {
    return pricingOptions.map((option) => {
      const pricingOption: any = {
        pricingOptionKey: option.pricingOptionKey,
      };

      // Add currency details if present
      if (option.currency) {
        pricingOption.currency = {
          firstCurrencyDetails: {
            currencyQualifier:
              option.currency.firstCurrencyDetails.currencyQualifier,
            currencyIsoCode:
              option.currency.firstCurrencyDetails.currencyIsoCode,
          },
        };
      }

      // Add carrier information if present
      if (option.carrierInformation) {
        pricingOption.carrierInformation = {
          companyIdentification: {
            otherCompany: option.carrierInformation.otherCompany,
          },
        };
      }

      return pricingOption;
    });
  }

  createFareInformativePricingRequest(requestData: any) {
    const body: any = {
      'soapenv:Body': {
        Fare_InformativeBestPricingWithoutPNR: {
          passengersGroup: {},
        },
      },
    };

    if (requestData.passengersGroup) {
      body['soapenv:Body']['Fare_InformativeBestPricingWithoutPNR'][
        'passengersGroup'
      ] = this.createPassengersGroup(requestData.passengersGroup);
    }

    if (requestData.segmentGroup) {
      body['soapenv:Body'][
        'Fare_InformativeBestPricingWithoutPNR'
      ].segmentGroup = requestData.segmentGroup.map((segment) =>
        this.createSegmentInformation(segment),
      );
    }

    if (requestData.pricingOptionGroup) {
      body['soapenv:Body'][
        'Fare_InformativeBestPricingWithoutPNR'
      ].pricingOptionGroup = this.createPricingOptionGroup(
        requestData.pricingOptionGroup,
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
