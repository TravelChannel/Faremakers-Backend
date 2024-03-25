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
}
