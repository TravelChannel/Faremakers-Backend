import { Injectable, Inject, HttpStatus } from '@nestjs/common';
import { CreateSEOAirlinesDataDto } from './dto/create-seoAirlinesData.dto';
import { UpdateSEOAirlinesDataDto } from './dto/update-seoAirlinesData.dto';
import { SEO_AIRLINES_DATA_REPOSITORY } from '../../../shared/constants';
import { SEOAirlinesData } from './entities/seoAirlinesData.entity';
import { sequelize, Transaction } from '../../../database/sequelize.provider'; // Adjust the path accordingly
import { ResponseService } from '../../../common/utility/response/response.service';
import { EXCEPTION } from '../../../shared/messages.constants';
import { TopPicks } from '../../seo/topPicks';
import { TopCountries } from '../../seo/topCountries';
import { TopCities } from '../../seo/topCities';

@Injectable()
export class SEOAirlinesDataService {
  constructor(
    @Inject(SEO_AIRLINES_DATA_REPOSITORY)
    private seoAirlinesDataRepository: typeof SEOAirlinesData,
    private readonly responseService: ResponseService,
  ) {}

  async create() {
    const t: Transaction = await sequelize.transaction();

    try {
      // const { ...rest } = createSEOAirlinesDataDto;
      const SEOAirlinesData = [
        {
          id: 1,
          flightname: 'Emirates-Airline',
          flightCode: 'EK',
          mainHeading: 'Top Destinations of Emirates',
          heading1: 'Emirates Top Picks',
          heading2: 'Emirates Top Countries',
          heading3: 'Emirates Top Cities',
          topPicks: [
            { destination: 'Dubai (DXB)' },
            { destination: 'Singapore (SIN)' },
            { destination: 'Mauritius (MRU)' },
            { destination: 'Hong Kong (HKG)' },
            { destination: 'Dublin (DUB)' },
          ],
          topCountries: [
            { destination: 'Flights to United Arab Emirates' },
            { destination: 'Flights to New Zealand' },
            { destination: 'Flights to Australia' },
            { destination: 'Flights to India' },
            { destination: 'Flights to Canada' },
          ],
          topCities: [
            { destination: 'Flights to Sialkot (SKT)' },
            { destination: 'Flights to Perth (PER)' },
            { destination: 'Flights to Boston (BOS)' },
            { destination: 'Flights to Brisbane (BNE)' },
            { destination: 'Flights to Budapest' },
          ],
        },
        {
          id: 2,
          flightname: 'qatar-airways-flights',
          flightCode: 'QR',
          mainHeading: 'Qatar Airways Flights',
          heading1: 'Qatar Airways Flights To EUROPE',
          heading2: 'Qatar Airways Flights to AMERICAS',
          heading3: 'Qatar Airways Flights to ASIA',
          topPicks: [
            { destination: 'Flights to London' },
            { destination: 'Flights to Paris' },
            { destination: 'Flights to Barcelona' },
            { destination: 'Flights to Istanbul' },
            { destination: 'Flights to Frankfurt' },
          ],
          topCountries: [
            { destination: 'Flights to New York' },
            { destination: 'Flights to Boston' },
            { destination: 'Flights to Miami' },
            { destination: 'Flights to Washington' },
            { destination: 'Flights to Chicago' },
          ],
          topCities: [
            { destination: 'Flights to Bangkok' },
            { destination: 'Flights to Pakistan' },
            { destination: 'Flights to Kuala Lumpur' },
            { destination: 'Flights to Australia' },
            { destination: 'Flights to Hong Kong' },
          ],
        },
        {
          id: 3,
          flightname: 'turkish-airlines-flights',
          flightCode: 'TK',
          mainHeading: 'Top Destinations of Turkish Airlines',
          heading1: 'Turkish Airlines Flight to UK',
          heading2: 'Turkish Airlines Flights to USA',
          heading3: 'Turkish Airlines flights to KSA',
          topPicks: [
            { destination: 'Flights to London' },
            { destination: 'Flights to Manchester' },
            { destination: 'Flights to Edinburgh' },
            { destination: 'Flights to Brimingham' },
          ],
          topCountries: [
            { destination: 'Flights to New York' },
            { destination: 'Flights to Washington DC' },
            { destination: 'Flights to Miami' },
            { destination: 'Flights to Boston' },
          ],
          topCities: [
            { destination: 'Flights to Madina' },
            { destination: 'Flights to Riyadh' },
            { destination: 'Flights to Jeddah' },
            { destination: 'Flights to Dammam' },
          ],
        },
        {
          id: 4,
          flightname: 'pakistan-international-airlines-flights',
          flightCode: 'PK',
          mainHeading: 'Top Destinations of PIA',
          heading1: 'PIA Domestic Flights',
          heading2: 'PIA Flights to Saudi Arabia',
          heading3: 'PIA Flights to UAE',
          subheading1: 'PIA Flights to UK',
          subheading2: 'PIA Flights to Top Cities',
          subheading3: 'PIA Flights Top Picks',
          topPicks: [
            { destination: 'Flights to Lahore(LHE)' },
            { destination: 'Flights to Karachi(KHI)' },
            { destination: 'Flights to Islamabad(ISB)' },
            { destination: 'Flights to Peshawar(PEW)' },
            { destination: 'Flights to Multan(MUX)' },
          ],
          topCountries: [
            { destination: 'Flights to Jeddah(JED)' },
            { destination: 'Flights to Riyadh(RUH)' },
            { destination: 'Flights to Madina(MED)' },
            { destination: 'Flights to Dammam(DMM)' },
            { destination: 'Flights to Dharan(DHA)' },
          ],
          topCities: [
            { destination: 'Flights to Dubai(DXB)' },
            { destination: 'Flights to Abu Dhabi(AUH)' },
            { destination: 'Flights to Sharjah(SHJ)' },
            { destination: 'Flights to Al Ain(AAN)' },
            { destination: 'Flights to Ras-alKhaima(RKT)' },
          ],
          subheading1data: [
            { destination: 'Flights to London(LON)' },
            { destination: 'Flights to Manchester(MAN)' },
            { destination: 'Flights to Brimingham(BHX)' },
          ],
          subheading2data: [
            { destination: 'Flights to Toronto(YTO)' },
            { destination: 'Flights to Beijing(BJS)' },
            { destination: 'Flights to Paris(PAR)' },
          ],
          subheading3data: [
            { destination: 'Flights to Najaf(NJF)' },
            { destination: 'Flights to Muscat(MCT)' },
            { destination: 'Flights to Doha(DOH)' },
          ],
        },
        {
          id: 5,
          flightname: 'oman-air-flights',
          flightCode: 'WY',
          mainHeading: 'Top Destinations of Oman Air',
          heading1: 'Oman Air Flights To GULF',
          heading2: 'Oman Air Flights to SOUTH ASIA',
          heading3: 'Oman Air Flights to EUROPE',
          topPicks: [
            { destination: 'Flights to Oman' },
            { destination: 'Flights to Kuwait' },
            { destination: 'Flights to Qatar' },
            { destination: 'Flights to Saudi Arabia' },
            { destination: 'Flights to UAE' },
          ],
          topCountries: [
            { destination: 'Flights to Bangaladesh' },
            { destination: 'Flights to India' },
            { destination: 'Flights to Pakistan' },
            { destination: 'Flights to Nepal' },
            { destination: 'Flights to Srilanka' },
          ],
          topCities: [
            { destination: 'Flights to France' },
            { destination: 'Flights to Germany' },
            { destination: 'Flights to United Kingdom' },
            { destination: 'Flights to Italy' },
            { destination: 'Flights to Switzerland' },
          ],
        },
        {
          id: 6,
          flightname: 'Fly-with-FlyDubai',
          flightCode: 'FZ',
          mainHeading: 'Top Destinations of FlyDubai',
          heading1: 'FlyDubai Top Picks',
          heading2: 'FlyDubai Top Countries',
          heading3: 'FlyDubai Top Cities',
          topPicks: [
            { destination: 'Flights to Dubai(DXB)' },
            { destination: 'Flights to Singapore (SIN)' },
            { destination: 'Flights to Mauritius (MRU)' },
            { destination: 'Flights to Hong Kong (HKG)' },
            { destination: 'Flights to Dublin (DUB)' },
          ],
          topCountries: [
            { destination: 'Flights to United Arab Emirates' },
            { destination: 'Flights to New Zealand' },
            { destination: 'Flights to Australia' },
            { destination: 'Flights to India' },
            { destination: 'Flights to Canada' },
          ],
          topCities: [
            { destination: 'Flights to Sialkot (SKT)' },
            { destination: 'Flights to Perth (PER)' },
            { destination: 'Flights to Boston (BOS)' },
            { destination: 'Flights to Brisbane (BNE)' },
            { destination: 'Flights to Budapest' },
          ],
        },
        {
          id: 7,
          flightname: 'etihad-airways-flights',
          flightCode: 'EY',
          mainHeading: 'Top Destinations of Etihad Airways',
          heading1: 'Etihad Airways Top Picks',
          heading2: 'Etihad Airways Top Countries',
          heading3: 'Etihad Airways Top Cities',
          topPicks: [
            { destination: 'Flights to London (LON)' },
            { destination: 'Flights to Toronto (YTO)' },
            { destination: 'Flights to Beijing (BJS)' },
            { destination: 'Flights to New York (NYC)' },
            { destination: 'Flights to Istanbul (IST)' },
          ],
          topCountries: [
            { destination: 'Flights to UAE' },
            { destination: 'Flights to UK' },
            { destination: 'Flights to Saudi Arabia' },
            { destination: 'Flights to India' },
            { destination: 'Flights to Australia' },
          ],
          topCities: [
            { destination: 'Flights to Lahore (LHE)' },
            { destination: 'Flights to Manila (MNL)' },
            { destination: 'Flights to Medina (MED)' },
            { destination: 'Flights to Singapore (SIN)' },
            { destination: 'Flights to Manchester (MAN)' },
          ],
        },
        {
          id: 8,
          flightname: 'shaheen-air-flights',
          flightCode: 'NL',
          mainHeading: 'Top Destinations of Shaheen Airline',
          heading1: 'Shaheen Airline Domestic Flights',
          heading2: 'Shaheen Airline Top Countries',
          heading3: 'Shaheen Airline Top Picks',
          topPicks: [
            { destination: 'Flights to Oman' },
            { destination: 'Flights to Kuwait' },
            { destination: 'Flights to Iran' },
            { destination: 'Flights to Malaysia' },
            { destination: 'Flights to Dubai' },
          ],
          topCountries: [
            { destination: 'Flights to United Arab Emirates' },
            { destination: 'Flights to Saudi Arabia' },
            { destination: 'Flights to China' },
            { destination: 'Flights to United Kingdom' },
            { destination: 'Flights to Qatar' },
          ],
          topCities: [
            { destination: 'Flights to Lahore (LHE)' },
            { destination: 'Flights to Islamabad (ISB)' },
            { destination: 'Flights to Karachi (KHI)' },
            { destination: 'Flights to Multan (MUX)' },
            { destination: 'Flights to Peshawar (PEW)' },
          ],
        },
        {
          id: 9,
          flightname: 'airblue-flights',
          flightCode: 'PA',
          mainHeading: 'Top Destinations of Air Blue',
          heading1: 'Airblue Domestic Flights',
          heading2: 'Flights to Jeddah',
          heading3: 'Airblue Flights to Madina',
          subheading1: 'Airblue Flights to Riyadh',
          subheading2: 'Airblue Flights to Dammam',
          subheading3: 'Airblue Flights to Dubai',
          topPicks: [
            { destination: 'Lahore(LHE)-Islamabad(ISB) Air Blue' },
            { destination: 'Lahore(LHE)-Karachi(KHI) Air Blue' },
            { destination: 'Lahore(LHE)-Peshawar(PEW) Air Blue' },
            { destination: 'Lahore(LHE)-Multan(MUX) Air Blue' },
            { destination: 'Lahore(LHE)-Sialkot(SKT) Air Blue' },
          ],
          topCountries: [
            { destination: 'Lahore(LHE)-Jeddah(JED) Air Blue' },
            { destination: 'Karachi(KHI)-Jeddah(JED) Air Blue' },
            { destination: 'Islamabad(ISB)-Jeddah(JED) Air Blue' },
            { destination: 'Multan(MUX)-Jeddah(JED) Air Blue' },
            { destination: 'Peshawar(PEW)-Jeddah(JED) Air Blue' },
          ],
          topCities: [
            { destination: 'Lahore(LHE)-Madina(MED) Air Blue' },
            { destination: 'Karachi(KHI)-Madina(MED) Air Blue' },
            { destination: 'Islamabad(ISB)-Madina(MED) Air Blue' },
            { destination: 'Multan(MUX)-Madina(MED) Air Blue' },
            { destination: 'Peshawar(PEW)-Madina(MED) Air Blue' },
          ],
          subheading1data: [
            { destination: 'Lahore(LHE)-Riyadh(RUH) Air Blue' },
            { destination: 'Karachi(KHI)-Riyadh(RUH) Air Blue' },
            { destination: 'Islamabad(ISB)-Riyadh(RUH) Air Blue' },
            { destination: 'Multan(MUX)-Riyadh(RUH) Air Blue' },
            { destination: 'Peshawar(PEW)-Riyadh(RUH) Air Blue' },
          ],
          subheading2data: [
            { destination: 'Lahore(LHE)-Dammam(DMM) Air Blue' },
            { destination: 'Karachi(KHI)-Dammam(DMM) Air Blue' },
            { destination: 'Islamabad(ISB)-Dammam(DMM) Air Blue' },
            { destination: 'Multan(MUX)-Dammam(DMM) Air Blue' },
            { destination: 'Peshawar(PEW)-Dammam(DMM) Air Blue' },
          ],
          subheading3data: [
            { destination: 'Lahore(LHE)-Dubai(DXB) Air Blue' },
            { destination: 'Karachi(KHI)-Dubai(DXB) Air Blue' },
            { destination: 'Islamabad(ISB)-Dubai(DXB) Air Blue' },
            { destination: 'Multan(MUX)-Dubai(DXB) Air Blue' },
            { destination: 'Peshawar(PEW)-Dubai(DXB) Air Blue' },
          ],
        },
        {
          id: 10,
          flightname: 'air-sial-flights',
          flightCode: 'PF',
          mainHeading: 'Air Sial Top Destinations',
          heading1: 'Air Sial Top Picks',
          heading2: 'Air Sial Top Countries',
          heading3: 'Air Sial Top Cities',
          topPicks: [
            { destination: 'Flights to Lahore' },
            { destination: 'Flights to Karachi' },
          ],
          topCountries: [
            { destination: 'Flights to Islamabad' },
            { destination: 'Flight to Sialkot' },
          ],
          topCities: [
            { destination: 'Flights to Peshawar' },
            { destination: 'Flights to Sabiha' },
          ],
        },
        {
          id: 11,
          flightname: 'virgin-atlantic-flights',
          flightCode: 'VS',
          mainHeading: 'Virgin Atlantic Airways Top Destinations',
          heading1: 'Virgin Atlantic Top Picks',
          heading2: 'Virgin Atlantic Top Countries',
          heading3: 'Virgin Atlantic Top Cities',
          topPicks: [
            { destination: 'Flights to London' },
            { destination: 'Flights to Manchester' },
            { destination: 'Flights to Los Angeles' },
          ],
          topCountries: [
            { destination: 'Flights to Birmingham' },
            { destination: 'Flight to New York' },
            { destination: 'Flights to Shanghai' },
          ],
          topCities: [
            { destination: 'Flights to Miami' },
            { destination: 'Flights to Boston' },
            { destination: 'Flights to Dubai' },
          ],
        },
        {
          id: 12,
          flightname: 'thai-airways-flights',
          flightCode: 'TG',
          mainHeading: 'Top Destinations of Thai Airline',
          heading1: 'Thai Airline Top Picks',
          heading2: 'Thai Airline Top Countries',
          heading3: 'Thai Airline Top Cities',
          topPicks: [
            { destination: 'Flights to Bangkok(BKK)' },
            { destination: 'Flights to London(LON)' },
            { destination: 'Flights to Muscat(MCT)' },
            { destination: 'Flights to Dubai (DXB)' },
            { destination: 'Flights to Beijing (BJS)' },
          ],
          topCountries: [
            { destination: 'Flights to Australia' },
            { destination: 'Flights to China' },
            { destination: 'Flights to Pakistan' },
            { destination: 'Flights to India' },
            { destination: 'Flights to Germany' },
          ],
          topCities: [
            { destination: 'Flights to Paris (PAR)' },
            { destination: 'Flights to Oslo (OSL)' },
            { destination: 'Flights to Singapore (SIN)' },
            { destination: 'Flights to Kuala Lumpur (KUL)' },
            { destination: 'Flights to Jakarta(JKT)' },
          ],
        },
        {
          id: 13,
          flightname: 'serene-air-flights',
          flightCode: 'MK',
          mainHeading: 'Top Destinations of Serene Air',
          heading1: 'Serene Air Top Picks',
          heading2: 'Serene Air Top Countries',
          heading3: 'Serene Air Top Cities',
          topPicks: [
            { destination: 'Flights to Lahore' },
            { destination: 'Flights to Karachi' },
          ],
          topCountries: [
            { destination: 'Flights to Islamabad' },
            { destination: ' Flights to Faisalabad' },
          ],
          topCities: [
            { destination: 'Flights to Quetta' },
            { destination: 'Flights to Peshawar' },
          ],
        },
        {
          id: 14,
          flightname: 'kuwait-airways-flights',
          flightCode: 'KU',
          mainHeading: 'Top Destinations of Kuwait Airways',
          heading1: 'Kuwait Airways Top Picks',
          heading2: 'Kuwait Airways Top Countries',
          heading3: 'Kuwait Airways Top Cities',
          topPicks: [
            { destination: 'Flights to London' },
            { destination: 'Flights to New York' },
            { destination: 'Flights to Milan' },
          ],
          topCountries: [
            { destination: 'Flights to Frankfurt' },
            { destination: 'Flights to Istanbul' },
            { destination: 'Flights to Rome' },
          ],
          topCities: [
            { destination: 'Flights to Baku' },
            { destination: 'Flights to Jeddah' },
            { destination: 'Flights to Bangkok' },
          ],
        },
        {
          id: 15,
          flightname: 'china-southern-airlines-flights',
          flightCode: 'CZ',
          mainHeading: 'China Southern Airlines Top Destinations',
          heading1: 'China Southern Top Picks',
          heading2: 'China Southern Top Countries',
          heading3: 'China Southern Top Cities',
          topPicks: [
            { destination: 'Flights to GuangZhou' },
            { destination: 'Flights to BeiJing' },
            { destination: 'Flights to HangZhou' },
          ],
          topCountries: [
            { destination: 'Flights to Urumqi' },
            { destination: 'Flights to Shanghai' },
            { destination: 'Flights to Xian Xianyang' },
          ],
          topCities: [
            { destination: 'Flights to Los Angeles' },
            { destination: 'Flights to London' },
            { destination: 'Flights to Singapore' },
          ],
        },
        {
          id: 16,
          flightname: 'saudi-arabian-airline-flights',
          flightCode: 'SV',
          mainHeading: 'Saudi Arabian Airlines Top Destinations',
          heading1: 'Saudi Arabian  Top Picks',
          heading2: 'Saudi Arabian  Top Countries',
          heading3: 'Saudi Arabian  Top Cities',
          topPicks: [
            { destination: 'Flights to Jeddah' },
            { destination: 'Flights to Medina' },
            { destination: 'Flights to Riyadh' },
          ],
          topCountries: [
            { destination: 'Flights to Kuwait' },
            { destination: 'Flights to Paris' },
            { destination: 'Flights to New York' },
          ],
          topCities: [
            { destination: 'Flights to London' },
            { destination: 'Flights to Frankfurt' },
            { destination: 'Flights to Johannesburg' },
          ],
        },
        {
          id: 17,
          flightname: 'air-arabia-flights',
          flightCode: 'SVA',
          mainHeading: 'Air Arabia Airlines Top Destinations',
          heading1: 'Air Arabia  Top Picks',
          heading2: 'Air Arabia  Top Countries',
          heading3: 'Air Arabia  Top Cities',
          topPicks: [
            { destination: 'Flights to Dubai' },
            { destination: 'Flights to Abu Dhabi' },
          ],
          topCountries: [
            { destination: 'Flights to Ras Al Khaimah' },
            { destination: 'Flights to Al Ain' },
          ],
          topCities: [
            { destination: 'Flights to Jizan' },
            { destination: 'Flights to Sabiha' },
          ],
        },
        {
          id: 18,
          flightname: 'air-china-flights',
          flightCode: 'CI',
          mainHeading: 'Air China Airlines Top Destinations',
          topPicks: [
            { destination: 'Flights to Beijing' },
            { destination: 'Flights to Shanghai' },
          ],
          topCountries: [
            { destination: 'Flights to Hongkong' },
            { destination: 'Flights to Korea' },
          ],
          topCities: [
            { destination: 'Flights to Vietnam' },
            { destination: 'Flights to Munich' },
          ],
        },
        {
          id: 19,
          flightname: "'air-malindo-flights",
          flightCode: 'OD',
          mainHeading: 'Air Malindo Airlines Top Destinations',
          topPicks: [
            { destination: 'Flights to Malaysia' },
            { destination: 'Flights to Thailand' },
          ],
          topCountries: [
            { destination: 'Flights to Melbourne' },
            { destination: 'Flights to Colombo' },
          ],
          topCities: [
            { destination: 'Flights to Indonesia' },
            { destination: 'Flights to Singapore' },
          ],
        },
        {
          id: 20,
          flightname: 'british-airways-flights',
          flightCode: 'BA',
          mainHeading: 'British Airways Top Destinations',
          topPicks: [
            { destination: 'Flights to London(LHR)' },
            { destination: 'Flights to New York (JFK)' },
            { destination: 'Flights to Toronto (YYZ)' },
          ],
          topCountries: [
            { destination: 'Flights to Washington' },
            { destination: 'Flights to Chicago' },
            { destination: 'Flights to Boston' },
          ],
          topCities: [
            { destination: 'Flights to Los Angeles (LAX)' },
            { destination: 'Flights to Frankfurt' },
            { destination: 'Flights to Rome' },
          ],
        },
      ];
      const ss = await Promise.all(
        SEOAirlinesData.map(async (element) => {
          console.log(1);
          const newSeoAirlinesData =
            await this.seoAirlinesDataRepository.create(
              {
                flightname: element.flightname,
                flightCode: element.flightCode,
                mainHeading: element.mainHeading,
                heading1: element.heading1,
                heading2: element.heading2,
                heading3: element.heading3,
              },
              { transaction: t },
            );
          await Promise.all(
            element.topPicks.map(async (element2) => {
              console.log(2);

              const newTopPicks = await TopPicks.create(
                {
                  seoAirlinesDataId: newSeoAirlinesData.id,
                  destination: element2.destination,
                },
                { transaction: t },
              );
            }),
          );
          await Promise.all(
            element.topCountries.map(async (element2) => {
              console.log(3);

              const newTopCountries = await TopCountries.create(
                {
                  seoAirlinesDataId: newSeoAirlinesData.id,

                  destination: element2.destination,
                },
                { transaction: t },
              );
            }),
          );
          await Promise.all(
            element.topCities.map(async (element2) => {
              const newTopCities = await TopCities.create(
                {
                  seoAirlinesDataId: newSeoAirlinesData.id,

                  destination: element2.destination,
                },
                { transaction: t },
              );
            }),
          );
        }),
      );

      await t.commit();

      return this.responseService.createResponse(
        HttpStatus.OK,
        null,
        'SEOAirlinesData Added',
      );
    } catch (error) {
      console.log('error******', error);
      // await t.rollback();
      return this.responseService.createResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        null,
        error,
      );
    }
  }

  async findAll(): Promise<SEOAirlinesData[]> {
    try {
      const promotion = await this.seoAirlinesDataRepository.findAll();
      return this.responseService.createResponse(
        HttpStatus.OK,
        promotion,
        'promotion Fetched',
      );
    } catch (error) {
      // await t.rollback();
      return this.responseService.createResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        null,
        EXCEPTION,
      );
    }
  }

  async findOne(id: number) {
    try {
      const promotion = await this.seoAirlinesDataRepository.findByPk(id, {});
      return this.responseService.createResponse(
        HttpStatus.OK,
        { ...promotion.toJSON() },
        'promotion retrieved successfully',
      );
    } catch (error) {
      return this.responseService.createResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        null,
        error.message,
      );
    }
  }

  async update(id: number, updateSEOAirlinesDataDto: UpdateSEOAirlinesDataDto) {
    const t = await sequelize.transaction(); // Start the transaction

    try {
      const promotion = await this.seoAirlinesDataRepository.findByPk(id);
      if (promotion) {
        promotion.flightname = updateSEOAirlinesDataDto.flightname;
        promotion.flightCode = updateSEOAirlinesDataDto.flightCode;
        await promotion.save();
      } else {
        return this.responseService.createResponse(
          HttpStatus.NOT_FOUND,
          null,
          'SEOAirlinesData Not Found',
        );
      }
      return this.responseService.createResponse(
        HttpStatus.OK,
        null,
        'SEOAirlinesData updated successfully',
      );
    } catch (error) {
      await t.rollback();
      return this.responseService.createResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        null,
        error.message,
      );
    }
  }

  async remove(id: number): Promise<void> {
    const t: Transaction = await sequelize.transaction();

    try {
      const promotion = await this.seoAirlinesDataRepository.findByPk(id);
      if (!promotion) {
        return this.responseService.createResponse(
          HttpStatus.NOT_FOUND,
          null,
          'promotion not found',
        );
      }

      await promotion.destroy({ transaction: t });
      await t.commit();

      return this.responseService.createResponse(
        HttpStatus.OK,
        null,
        'Success',
      );
    } catch (error) {
      await t.rollback();

      return this.responseService.createResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        null,
        error.message,
      );
    }
  }
  async getDropdown() {
    try {
      const dropdownsArray = await this.seoAirlinesDataRepository.findAll({
        attributes: ['id', 'title'],
        // include: [Right],
      });
      return this.responseService.createResponse(
        HttpStatus.OK,
        dropdownsArray,
        'Success',
      );
    } catch (error) {
      return this.responseService.createResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        null,
        EXCEPTION,
      );
    }
  }
}
