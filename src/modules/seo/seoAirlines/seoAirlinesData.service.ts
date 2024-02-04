import { Injectable, Inject, HttpStatus } from '@nestjs/common';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { SEO_AIRLINES_DATA_REPOSITORY } from '../../../shared/constants';
import { SEOAirlinesData } from './entities/seoAirlinesData.entity';
import { sequelize, Transaction } from '../../../database/sequelize.provider'; // Adjust the path accordingly
import { ResponseService } from '../../../common/utility/response/response.service';
import { EXCEPTION } from '../../../shared/messages.constants';

@Injectable()
export class SEOAirlinesDataService {
  constructor(
    @Inject(SEO_AIRLINES_DATA_REPOSITORY)
    private seoAirlinesDataRepository: typeof SEOAirlinesData,
    private readonly responseService: ResponseService,
  ) {}

  async create(createPromotionDto: CreatePromotionDto) {
    const t: Transaction = await sequelize.transaction();

    try {
      const { ...rest } = createPromotionDto;

      const newRole = await this.seoAirlinesDataRepository.create(
        { title: rest.title, description: rest.description },
        { transaction: t },
      );

      await t.commit();

      return this.responseService.createResponse(
        HttpStatus.OK,
        newRole,
        'SEOAirlinesData Added',
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

  async update(id: number, updatePromotionDto: UpdatePromotionDto) {
    const t = await sequelize.transaction(); // Start the transaction

    try {
      const promotion = await this.seoAirlinesDataRepository.findByPk(id);
      if (promotion) {
        promotion.title = updatePromotionDto.title;
        promotion.description = updatePromotionDto.description;
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
