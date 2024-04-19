/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, Inject, HttpStatus } from '@nestjs/common';
import { GENERAL_TASKS_REPOSITORY } from '../../../shared/constants';
import { GeneralTask } from './entities/generalTask.entity';
import { sequelize, Transaction } from '../../../database/sequelize.provider'; // Adjust the path accordingly
import { ResponseService } from '../../../common/utility/response/response.service';
import { EXCEPTION } from '../../../shared/messages.constants';
// import { ToggleIsActiveDto } from 'src/shared/dtos/toggleIsActive.dto';

@Injectable()
export class GeneralTasksService {
  constructor(
    @Inject(GENERAL_TASKS_REPOSITORY)
    private generalTasksRepository: typeof GeneralTask,
    private readonly responseService: ResponseService,
  ) {}
  async getDropdown() {
    try {
      const dropdownsArray = await this.generalTasksRepository.findAll({
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

  async getIsSabreCreateTicketAllowed(id: number): Promise<any> {
    try {
      const data = await this.generalTasksRepository.findAll(1);
      if (!data) {
        return this.responseService.createResponse(
          HttpStatus.NOT_FOUND,
          null,
          'Record not found',
        );
      }

      return this.responseService.createResponse(
        HttpStatus.OK,
        { data },
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
  async toggleStatusIsSabreCreateTicketAllowed(id: number): Promise<any> {
    const t: Transaction = await sequelize.transaction();

    try {
      const data = await this.generalTasksRepository.findAll(1);
      if (!data) {
        return this.responseService.createResponse(
          HttpStatus.NOT_FOUND,
          null,
          'Record not found',
        );
      }

      data.isSabreCreateTicketAllowed = !data.isSabreCreateTicketAllowed;

      await data.save({ transaction: t }); // Save the changes
      await t.commit();
      let message = '';
      if (data.isSabreCreateTicketAllowed || false === false) {
        message = 'isSabreCreateTicketAllowed de activated successfully';
      } else {
        message = 'isSabreCreateTicketAllowed activated successfully';
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
