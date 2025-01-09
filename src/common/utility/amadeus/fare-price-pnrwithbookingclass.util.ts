import { Injectable } from '@nestjs/common';
import { create } from 'xmlbuilder2';

@Injectable()
export class FarePricePNRWithBookingClassUtil {
  // Function to create pricing option group (for pricingOptionGroup in the request)
  createPricingOptionGroup(pricingOptions: any[]) {
    return pricingOptions.map((option) => ({
      pricingOptionKey: {
        pricingOptionKey: option.pricingOptionKey,
      },
    }));
  }

  // Function to create carrier information if present (for carrierInformation in the request)
  createCarrierInformation(carrierInformation: any) {
    return carrierInformation
      ? {
          carrierInformation: {
            companyIdentification: {
              otherCompany:
                carrierInformation.companyIdentification.otherCompany,
            },
          },
        }
      : {};
  }

  // Function to create currency information if present (for currency in the request)
  createCurrency(currency: any) {
    return currency
      ? {
          currency: {
            firstCurrencyDetails: {
              currencyQualifier:
                currency.firstCurrencyDetails.currencyQualifier,
              currencyIsoCode: currency.firstCurrencyDetails.currencyIsoCode,
            },
          },
        }
      : {};
  }

  // Function to create Fare_PricePNRWithBookingClass body
  createFarePricePNRWithBookingClass(requestData: any) {
    const body: any = {
      'soapenv:Body': {
        Fare_PricePNRWithBookingClass: {},
      },
    };

    // Add pricingOptionGroup to the body if present in requestData
    if (requestData.pricingOptionGroup) {
      body['soapenv:Body']['Fare_PricePNRWithBookingClass'][
        'pricingOptionGroup'
      ] = this.createPricingOptionGroup(requestData.pricingOptionGroup);
    }

    // Iterate through pricingOptionGroup to add more details
    if (requestData.pricingOptionGroup) {
      body['soapenv:Body']['Fare_PricePNRWithBookingClass'][
        'pricingOptionGroup'
      ] = requestData.pricingOptionGroup.map((option) => {
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
              otherCompany:
                option.carrierInformation.companyIdentification.otherCompany,
            },
          };
        }

        return pricingOption;
      });
    }

    return body;
  }

  // Function to convert the generated body into formatted XML
  convertToXML(object: any) {
    return create({ version: '1.0', encoding: 'UTF-8' })
      .ele(object)
      .end({ prettyPrint: true });
  }
}
