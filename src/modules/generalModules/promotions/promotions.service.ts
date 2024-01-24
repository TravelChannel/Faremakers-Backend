import { Injectable, Inject, HttpStatus } from '@nestjs/common';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { PROMOTIONS_REPOSITORY } from '../../../shared/constants';
import { Promotion } from './entities/promotion.entity';
import { sequelize, Transaction } from '../../../database/sequelize.provider'; // Adjust the path accordingly
import { ResponseService } from '../../../common/utility/response/response.service';
import { EXCEPTION } from '../../../shared/messages.constants';

@Injectable()
export class PromotionsService {
  constructor(
    @Inject(PROMOTIONS_REPOSITORY)
    private promotionsRepository: typeof Promotion,
    private readonly responseService: ResponseService,
  ) {}

  async create(createPromotionDto: CreatePromotionDto) {
    const t: Transaction = await sequelize.transaction();

    try {
      const { ...rest } = createPromotionDto;

      const newRole = await this.promotionsRepository.create(
        { name: rest.name, description: rest.description },
        { transaction: t },
      );

      await t.commit();

      return this.responseService.createResponse(
        HttpStatus.OK,
        newRole,
        'Promotion Added',
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

  async findAll(): Promise<Promotion[]> {
    try {
      const promotion = await this.promotionsRepository.findAll();
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
      const promotion = await this.promotionsRepository.findByPk(id, {});
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

  async update(id: number, updateRoleDto: UpdatePromotionDto) {
    const t = await sequelize.transaction(); // Start the transaction

    try {
      console.log('updateRoleDto', updateRoleDto, 'id', id);
      return this.responseService.createResponse(
        HttpStatus.OK,
        null,
        'Promotion updated successfully',
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
      const promotion = await this.promotionsRepository.findByPk(id);
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
      const dropdownsArray = await this.promotionsRepository.findAll({
        attributes: ['id', 'name'],
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
