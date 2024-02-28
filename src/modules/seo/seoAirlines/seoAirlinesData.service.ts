import { Injectable, Inject, HttpStatus } from '@nestjs/common';
// import { CreateSEOAirlinesDataDto } from './dto/create-seoAirlinesData.dto';
import { UpdateSEOAirlinesDataDto } from './dto/update-seoAirlinesData.dto';
import { SEO_AIRLINES_DATA_REPOSITORY } from '../../../shared/constants';
import { SEOAirlinesData } from './entities/seoAirlinesData.entity';
import { sequelize, Transaction } from '../../../database/sequelize.provider'; // Adjust the path accordingly
import { ResponseService } from '../../../common/utility/response/response.service';
import { EXCEPTION } from '../../../shared/messages.constants';
// import { TopPicks } from '../../seo/topPicks';
// import { TopCountries } from '../../seo/topCountries';
// import { TopCities } from '../../seo/topCities';
import { Airline } from '../../serviceCharges/airline/airline.entity';

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
          Code: 'AZ',
        },
        {
          Code: 'CA',
        },
        {
          Code: 'CX',
        },
        {
          Code: 'CZ',
        },
        {
          Code: 'EK',
        },
        {
          Code: 'OD',
        },
        {
          Code: 'EY',
        },
        {
          Code: 'GF',
        },
        {
          Code: 'KL',
        },
        {
          Code: 'KU',
        },
        {
          Code: 'LX',
        },
        {
          Code: 'PK',
        },
        {
          Code: 'QR',
        },
        {
          Code: 'SV',
        },
        {
          Code: 'TG',
        },
        {
          Code: 'TK',
        },
        {
          Code: 'UL',
        },
        {
          Code: '6S',
        },
        {
          Code: 'YO',
        },
        {
          Code: 'FZ',
        },
        {
          Code: 'HY',
        },
        {
          Code: 'LH',
        },
        {
          Code: 'WY',
        },
        //{
        //    "Code": "AA"
        //},
        {
          Code: 'PC',
        },
        {
          Code: 'BA',
        },
        {
          Code: 'VS',
        },
        {
          Code: 'KQ',
        },

        {
          Code: 'AC',
        },
        {
          Code: 'AF',
        },
        {
          Code: 'SQ',
        },
        {
          Code: 'DV',
        },
        {
          Code: 'GP',
        },
        {
          Code: 'ET',
        },
        {
          Code: 'DL',
        },
        {
          Code: 'AT',
        },
        {
          Code: 'J2',
        },
      ];
      await Promise.all(
        SEOAirlinesData.map(async (element) => {
          console.log(1);
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const newSeoAirlinesData = await Airline.create(
            {
              code: element.Code,
              description: element.Code,
              name: element.Code,
            },
            { transaction: t },
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
      await t.rollback();
      return this.responseService.createResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        null,
        error,
      );
    }
  }

  async findAll(): Promise<SEOAirlinesData[]> {
    try {
      const seoAirlinesData = await this.seoAirlinesDataRepository.findAll();
      return this.responseService.createResponse(
        HttpStatus.OK,
        seoAirlinesData,
        'seoAirlinesData Fetched',
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
      const seoAirlinesData = await this.seoAirlinesDataRepository.findByPk(
        id,
        {},
      );
      return this.responseService.createResponse(
        HttpStatus.OK,
        seoAirlinesData,
        'seoAirlinesData retrieved successfully',
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
      const seoAirlinesData = await this.seoAirlinesDataRepository.findByPk(id);
      if (seoAirlinesData) {
        seoAirlinesData.flightname = updateSEOAirlinesDataDto.flightname;
        seoAirlinesData.flightCode = updateSEOAirlinesDataDto.flightCode;
        await seoAirlinesData.save();
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
      const seoAirlinesData = await this.seoAirlinesDataRepository.findByPk(id);
      if (!seoAirlinesData) {
        return this.responseService.createResponse(
          HttpStatus.NOT_FOUND,
          null,
          'seoAirlinesData not found',
        );
      }

      await seoAirlinesData.destroy({ transaction: t });
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
