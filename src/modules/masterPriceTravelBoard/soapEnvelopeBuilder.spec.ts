const {
  createSOAPEnvelopeHeader,
  createNumberOfUnit,
  createPaxReference,
  createFareOptions,
  createTravelFlightInfo,
  createItinerary,
  buildSOAPEnvelope,
} = require('./soapEnvelopeBuilder');

// Mock environment variables and request data for testing
process.env.AMADEUS_USER_ID = 'testUser';
process.env.AMADEUS_OFFICE_ID = 'testOfficeID';

const messageID = 'testMessageID';
const nonce = 'testNonce';
const passwordDigest = 'testPasswordDigest';
const created = '2023-10-25T12:34:56Z';

describe('SOAP Envelope Builder', () => {
  describe('createSOAPEnvelopeHeader', () => {
    it('should create a SOAP envelope header with security credentials', () => {
      const header = createSOAPEnvelopeHeader();

      // Verify the structure of the SOAP envelope header
      expect(header['soapenv:Envelope']['soapenv:Header']).toBeDefined();
      expect(
        header['soapenv:Envelope']['soapenv:Header']['add:MessageID'],
      ).toBe(messageID);
      expect(
        header['soapenv:Envelope']['soapenv:Header']['oas:Security'][
          'oas:UsernameToken'
        ]['oas:Username'],
      ).toBe(process.env.AMADEUS_USER_ID);
    });
  });

  describe('createNumberOfUnit', () => {
    it('should create numberOfUnit structure with given details', () => {
      const numberOfUnit = createNumberOfUnit('250', 'RC');

      expect(numberOfUnit.numberOfUnit.unitNumberDetail.numberOfUnits).toBe(
        '250',
      );
      expect(numberOfUnit.numberOfUnit.unitNumberDetail.typeOfUnit).toBe('RC');
    });
  });

  describe('createPaxReference', () => {
    it('should create paxReference structure with given ptc and ref', () => {
      const paxReference = createPaxReference('ADT', '1');

      expect(paxReference.paxReference.ptc).toBe('ADT');
      expect(paxReference.paxReference.traveller.ref).toBe('1');
    });
  });

  describe('createFareOptions', () => {
    it('should create fareOptions with given price types', () => {
      const fareOptions = createFareOptions(['ET', 'RP', 'RU']);

      expect(
        fareOptions.fareOptions.pricingTickInfo.pricingTicketing.priceType,
      ).toEqual(
        expect.arrayContaining([
          { '#text': 'ET' },
          { '#text': 'RP' },
          { '#text': 'RU' },
        ]),
      );
    });
  });

  describe('createTravelFlightInfo', () => {
    it('should create travelFlightInfo with given cabin and carrierId', () => {
      const travelFlightInfo = createTravelFlightInfo('Y', 'UA');

      expect(travelFlightInfo.travelFlightInfo.cabinId.cabin).toBe('Y');
      expect(travelFlightInfo.travelFlightInfo.companyIdentity.carrierId).toBe(
        'UA',
      );
    });
  });

  describe('createItinerary', () => {
    it('should create itinerary structure with given departure, arrival, and date', () => {
      const itinerary = createItinerary('ORD', 'ATL', '261024');

      expect(
        itinerary.itinerary.departureLocalization.departurePoint.locationId,
      ).toBe('ORD');
      expect(
        itinerary.itinerary.arrivalLocalization.arrivalPointDetails.locationId,
      ).toBe('ATL');
      expect(itinerary.itinerary.timeDetails.firstDateTimeDetail.date).toBe(
        '261024',
      );
    });
  });

  describe('buildSOAPEnvelope', () => {
    it('should build a complete SOAP envelope with header and body', () => {
      const requestData = {
        numberOfUnit: { number: '250', type: 'RC' },
        paxReference: { ptc: 'ADT', ref: '1' },
        fareOptions: { priceTypes: ['ET', 'RP', 'RU'] },
        travelFlightInfo: { cabin: 'Y', carrierId: 'UA' },
        itinerary: { departureId: 'ORD', arrivalId: 'ATL', date: '261024' },
      };

      const envelope = buildSOAPEnvelope(requestData);

      // Check if the XML structure contains header and body data
      expect(envelope).toContain('<soapenv:Envelope');
      expect(envelope).toContain('<soapenv:Header>');
      expect(envelope).toContain('<add:MessageID>');
      expect(envelope).toContain('<oas:Username>');
      expect(envelope).toContain(process.env.AMADEUS_USER_ID);
      expect(envelope).toContain('<soapenv:Body>');
      expect(envelope).toContain('<numberOfUnits>250</numberOfUnits>');
      expect(envelope).toContain('<ptc>ADT</ptc>');
      expect(envelope).toContain('<priceType>ET</priceType>');
      expect(envelope).toContain('<cabin>Y</cabin>');
      expect(envelope).toContain('<locationId>ORD</locationId>');
    });
  });
});
