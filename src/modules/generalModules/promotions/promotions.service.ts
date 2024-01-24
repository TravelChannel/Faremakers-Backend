import { Injectable, Inject, HttpStatus } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PROMOTIONS_REPOSITORY } from '../../../shared/constants';
import { Role } from './entities/role.entity';
import { sequelize, Transaction } from '../../../database/sequelize.provider'; // Adjust the path accordingly
import { ResponseService } from '../../../common/utility/response/response.service';
import { EXCEPTION } from '../../../shared/messages.constants';

@Injectable()
export class PromotionsService {
  constructor(
    @Inject(PROMOTIONS_REPOSITORY)
    private promotionsRepository: typeof Role,
    private readonly responseService: ResponseService,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    const t: Transaction = await sequelize.transaction();

    try {
      const { ...rest } = createRoleDto;

      const newRole = await this.promotionsRepository.create(
        { name: rest.name, description: rest.description },
        { transaction: t },
      );

      await t.commit();

      return this.responseService.createResponse(
        HttpStatus.OK,
        newRole,
        'Role Added',
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

  async findAll(): Promise<Role[]> {
    try {
      const role = await this.promotionsRepository.findAll();
      return this.responseService.createResponse(
        HttpStatus.OK,
        role,
        'Roles Fetched',
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
      const role = await this.promotionsRepository.findByPk(id, {});
      return this.responseService.createResponse(
        HttpStatus.OK,
        { ...role.toJSON() },
        'role retrieved successfully',
      );
    } catch (error) {
      return this.responseService.createResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        null,
        error.message,
      );
    }
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const t = await sequelize.transaction(); // Start the transaction

    try {
      console.log('updateRoleDto', updateRoleDto, 'id', id);
      return this.responseService.createResponse(
        HttpStatus.OK,
        null,
        'Role updated successfully',
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
      const role = await this.promotionsRepository.findByPk(id);
      if (!role) {
        return this.responseService.createResponse(
          HttpStatus.NOT_FOUND,
          null,
          'role not found',
        );
      }

      await role.destroy({ transaction: t });
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
