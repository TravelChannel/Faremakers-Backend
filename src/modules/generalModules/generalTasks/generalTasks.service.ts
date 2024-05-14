/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, Inject, HttpStatus } from '@nestjs/common';
import { GENERAL_TASKS_REPOSITORY } from '../../../shared/constants';
import { GeneralTask } from './entities/generalTask.entity';
import { sequelize, Transaction } from '../../../database/sequelize.provider'; // Adjust the path accordingly
import { ResponseService } from '../../../common/utility/response/response.service';
import { EXCEPTION } from '../../../shared/messages.constants';
// import { ToggleIsActiveDto } from 'src/shared/dtos/toggleIsActive.dto';
import { FlightSearches } from '../flightSearches';
import { FlightSearchesDetail } from '../flightSearchesDetail';

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

  async flightSearch(payload: any): Promise<any> {
    const t: Transaction = await sequelize.transaction();

    try {
      if (
        payload.departure.length !== payload.arrival.length ||
        payload.departure.length !== payload.date.length ||
        payload.arrival.length !== payload.date.length
      ) {
        return this.responseService.createResponse(
          HttpStatus.BAD_REQUEST,
          null,
          'Lengths of departure, arrival, and date arrays do not match..',
        );
      }
      const newFlightSearch = await FlightSearches.create(
        {
          tripType: payload.tripType,
          adults: payload.adults,
          children: payload.children,
          infants: payload.infants,
          classtype: payload.classtype,
        },
        { transaction: t },
      );

      await Promise.all(
        payload.departure.map(async (element, index) => {
          console.log('index', index);
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const newFlightSearchesDetail = await FlightSearchesDetail.create(
            {
              flightSearchesId: newFlightSearch.id,
              cityFrom: element,
              cityTo: payload.arrival[index],
              departureDate: payload.date[index],
            },
            { transaction: t },
          );
        }),
      );
      await t.commit();

      return this.responseService.createResponse(
        HttpStatus.OK,
        newFlightSearch,
        'newFlightSearch Added',
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
  async getAllControls(): Promise<any> {
    try {
      const data = await this.generalTasksRepository.findAll();
      if (!data) {
        return this.responseService.createResponse(
          HttpStatus.NOT_FOUND,
          null,
          'Record not found',
        );
      }
      // Test
      return this.responseService.createResponse(
        HttpStatus.OK,
        { data },
        'Success',
      );
    } catch (error) {
      return this.responseService.createResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        null,
        error.message,
      );
    }
  }
  async getIsSabreCreateTicketAllowed(): Promise<any> {
    try {
      const data = await this.generalTasksRepository.findByPk(1);
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
      return this.responseService.createResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        null,
        error.message,
      );
    }
  }
  async toggleStatus(id: number): Promise<any> {
    const t: Transaction = await sequelize.transaction();

    try {
      const data = await this.generalTasksRepository.findByPk(id);
      if (!data) {
        return this.responseService.createResponse(
          HttpStatus.NOT_FOUND,
          null,
          'Record not found',
        );
      }

      data.flag = !data.flag;

      await data.save({ transaction: t }); // Save the changes
      await t.commit();
      let message = '';
      if (data.flag === false) {
        message = `Deactivated successfully `;
      } else {
        message = 'Activated successfully';
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
