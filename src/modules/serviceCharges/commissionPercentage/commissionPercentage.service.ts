import { Injectable, Inject, HttpStatus } from '@nestjs/common';
import { CreateCommissionPercentageDto } from './dto/create-commissionPercentage.dto';
import { UpdateCommissionPercentageDto } from './dto/update-commissionPercentage.dto';
import { COMMISSION_PERCENTAGE_REPOSITORY } from '../../../shared/constants';
import { CommissionPercentage } from './entities/commissionPercentage.entity';
import { sequelize, Transaction } from '../../../database/sequelize.provider'; // Adjust the path accordingly
import { ResponseService } from '../../../common/utility/response/response.service';
import { EXCEPTION } from '../../../shared/messages.constants';
// import { ToggleIsActiveDto } from 'src/shared/dtos/toggleIsActive.dto';

@Injectable()
export class CommissionPercentageService {
  constructor(
    @Inject(COMMISSION_PERCENTAGE_REPOSITORY)
    private commissionPercentageRepository: typeof CommissionPercentage,
    private readonly responseService: ResponseService,
  ) {}

  async create(createCommissionPercentageDto: CreateCommissionPercentageDto) {
    const t: Transaction = await sequelize.transaction();

    try {
      const { ...rest } = createCommissionPercentageDto;

      const newRole = await this.commissionPercentageRepository.create(
        { title: rest.title, description: rest.description },
        { transaction: t },
      );

      await t.commit();

      return this.responseService.createResponse(
        HttpStatus.OK,
        newRole,
        'CommissionPercentage Added',
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

  async findAll(): Promise<CommissionPercentage[]> {
    try {
      const commissionPercentage =
        await this.commissionPercentageRepository.findAll();
      return this.responseService.createResponse(
        HttpStatus.OK,
        commissionPercentage,
        'commissionPercentage Fetched',
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
      const commissionPercentage =
        await this.commissionPercentageRepository.findByPk(id, {});
      return this.responseService.createResponse(
        HttpStatus.OK,
        { ...commissionPercentage.toJSON() },
        'commissionPercentage retrieved successfully',
      );
    } catch (error) {
      return this.responseService.createResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        null,
        error.message,
      );
    }
  }

  async update(
    id: number,
    updateCommissionPercentageDto: UpdateCommissionPercentageDto,
  ) {
    const t = await sequelize.transaction(); // Start the transaction

    try {
      return this.responseService.createResponse(
        HttpStatus.NOT_FOUND,
        null,
        'CommissionPercentage Not Found',
      );
      t.commit();
      return this.responseService.createResponse(
        HttpStatus.OK,
        null,
        'CommissionPercentage updated successfully',
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
      const commissionPercentage =
        await this.commissionPercentageRepository.findByPk(id);
      if (!commissionPercentage) {
        return this.responseService.createResponse(
          HttpStatus.NOT_FOUND,
          null,
          'commissionPercentage not found',
        );
      }

      await commissionPercentage.destroy({ transaction: t });
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
      const dropdownsArray = await this.commissionPercentageRepository.findAll({
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
  async toggleStatus(id: number): Promise<any> {
    const t: Transaction = await sequelize.transaction();

    try {
      const whereOptions: any = {};
      whereOptions.id = id;

      const commissionPercentage =
        await this.commissionPercentageRepository.findOne({
          where: whereOptions,
        });
      if (!commissionPercentage) {
        return this.responseService.createResponse(
          HttpStatus.NOT_FOUND,
          null,
          'Record not found',
        );
      }

      commissionPercentage.isActive = !commissionPercentage.isActive;

      await commissionPercentage.save({ transaction: t }); // Save the changes
      await t.commit();
      let message = '';
      if (commissionPercentage.isActive || false === false) {
        message = 'CommissionPercentage deactivated successfully';
      } else {
        message = 'CommissionPercentage activated successfully';
      }
      return this.responseService.createResponse(HttpStatus.OK, null, message);
    } catch (error) {
      await t.rollback();
      return this.responseService.createResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        null,
        error.message,
      );
    }
  }
}