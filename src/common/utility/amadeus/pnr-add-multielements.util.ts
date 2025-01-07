import { Injectable } from '@nestjs/common';
import { create } from 'xmlbuilder2';

@Injectable()
export class PnrAddMultiElementsUtil {
  createPnrActions(optionCode: string) {
    return {
      pnrActions: {
        optionCode: optionCode,
      },
    };
  }

  createTravellerInfo(travellerInfoData: any[]) {
    return travellerInfoData.map((traveller) => {
      const elementManagementPassenger = {
        reference: {
          qualifier: traveller.elementManagementPassenger.reference.qualifier,
          number: traveller.elementManagementPassenger.reference.number,
        },
        segmentName: traveller.elementManagementPassenger.segmentName,
      };

      const passengerData = traveller.passengerData.map((data) => {
        const travellerInformation = {
          traveller: {
            surname: data.travellerInformation.traveller.surname,
            ...(data.travellerInformation.traveller.quantity && {
              quantity: data.travellerInformation.traveller.quantity,
            }),
          },
          passenger: {
            firstName: data.travellerInformation.passenger.firstName,
            type: data.travellerInformation.passenger.type,
            ...(data.travellerInformation.passenger.infantIndicator && {
              infantIndicator:
                data.travellerInformation.passenger.infantIndicator,
            }),
          },
        };

        const dateOfBirth = data.dateOfBirth
          ? {
              dateAndTimeDetails: {
                date: data.dateOfBirth.dateAndTimeDetails.date,
              },
            }
          : null;

        return {
          travellerInformation,
          ...(dateOfBirth && { dateOfBirth }),
        };
      });

      return {
        elementManagementPassenger,
        passengerData,
      };
    });
  }

  createDataElementsMaster(dataElementsIndiv: any[]) {
    return {
      marker1: {},
      dataElementsIndiv: dataElementsIndiv
        .map((element) => {
          const elementManagementData = {
            segmentName: element.elementManagementData.segmentName,
            ...(element.elementManagementData.reference && {
              reference: {
                qualifier: element.elementManagementData.reference.qualifier,
                number: element.elementManagementData.reference.number,
              },
            }),
          };

          if (element.freetextData) {
            return {
              elementManagementData,
              freetextData: {
                freetextDetail: {
                  subjectQualifier:
                    element.freetextData.freetextDetail.subjectQualifier,
                  type: element.freetextData.freetextDetail.type,
                },
                longFreetext: element.freetextData.longFreetext,
              },
            };
          }

          if (element.serviceRequest) {
            return {
              elementManagementData,
              serviceRequest: {
                ssr: {
                  type: element.serviceRequest.ssr.type,
                  status: element.serviceRequest.ssr.status,
                  companyId: element.serviceRequest.ssr.companyId,
                  freetext: element.serviceRequest.ssr.freetext,
                },
              },
            };
          }

          if (element.commission) {
            return {
              elementManagementData,
              commission: {
                commissionInfo: {
                  percentage: element.commission.commissionInfo.percentage,
                },
              },
            };
          }

          if (element.ticketElement) {
            return {
              elementManagementData,
              ticketElement: {
                ticket: {
                  indicator: element.ticketElement.ticket.indicator,
                },
              },
            };
          }

          return null;
        })
        .filter(Boolean),
    };
  }

  convertToXML(object: any) {
    return create({ version: '1.0', encoding: 'UTF-8' })
      .ele(object)
      .end({ prettyPrint: true });
  }

  createPNRAddMultiElements(requestData: any) {
    const body: any = {
      'soapenv:Body': {
        PNR_AddMultiElements: {},
      },
    };

    // Add pnrActions
    if (requestData.pnrActions) {
      Object.assign(
        body['soapenv:Body']['PNR_AddMultiElements'],
        this.createPnrActions(requestData.pnrActions.optionCode),
      );
    }

    // Add travellerInfo
    if (requestData.travellerInfo) {
      Object.assign(body['soapenv:Body']['PNR_AddMultiElements'], {
        travellerInfo: this.createTravellerInfo(requestData.travellerInfo),
      });
    }

    // Add dataElementsMaster
    if (requestData.dataElementsMaster) {
      Object.assign(body['soapenv:Body']['PNR_AddMultiElements'], {
        dataElementsMaster: this.createDataElementsMaster(
          requestData.dataElementsMaster.dataElementsIndiv,
        ),
      });
    }

    return body;
  }
}
