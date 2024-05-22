/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, Inject, HttpStatus } from '@nestjs/common';
import { GENERAL_TASKS_REPOSITORY } from '../../../shared/constants';
import { GeneralTask } from './entities/generalTask.entity';
import { Log } from '../../generalModules/systemLogs/entities/Log.entity';

import {
  Op,
  sequelize,
  Transaction,
} from '../../../database/sequelize.provider'; // Adjust the path accordingly
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

  async getFlightSearch(req): Promise<any> {
    try {
      const whereOptions: any = {};
      // if (req.query.blogTypeId) {
      //   whereOptions.blogTypeId = req.query.blogTypeId;
      // }
      if (req.query.startDate && req.query.endDate) {
        // Both startDate and endDate provided
        whereOptions.searchDate = {
          [Op.between]: [req.query.startDate, req.query.endDate],
        };
      } else if (req.query.startDate) {
        // Only startDate provided
        whereOptions.searchDate = {
          [Op.gte]: req.query.startDate,
        };
      } else if (req.query.endDate) {
        // Only endDate provided
        whereOptions.searchDate = {
          [Op.lte]: req.query.endDate,
        };
      }
      // Pagination parameters
      const page = parseInt(req.query.pageNumber, 10) || 1;
      const pageSize = parseInt(req.query.pageSize, 10) || 10;
      const { count, rows: flightSearches } =
        await FlightSearches.findAndCountAll({
          where: whereOptions,
          include: [
            {
              model: FlightSearchesDetail,
            },
          ],
          order: [
            ['createdAt', 'DESC'], // Replace 'createdAt' with the column you want to sort by
          ],
          distinct: true,
          limit: pageSize,
          offset: (page - 1) * pageSize,
        });
      console.log('count', count);
      console.log('page', page);
      console.log('pageSize', pageSize);
      console.log('limit', pageSize);
      console.log('offset', (page - 1) * pageSize);
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const moment = require('moment-timezone');

      // flightSearches.forEach((search) => {
      //   search.searchDate = moment(search.searchDate)
      //     .tz('+05:00')
      //     .format('YYYY-MM-DD HH:mm:ss Z');
      // });

      const totalPages = Math.ceil(count / pageSize);

      const links = {
        first: `/generalTask/flightSearch?pageNumber=1&pageSize=${pageSize}`,
        last: `/generalTask/flightSearch?pageNumber=${totalPages}&pageSize=${pageSize}`,
        prev:
          page > 1
            ? `/generalTask/flightSearch?pageNumber=${
                page - 1
              }&pageSize=${pageSize}`
            : null,
        next:
          page < totalPages
            ? `/generalTask/flightSearch?pageNumber=${
                page + 1
              }&pageSize=${pageSize}`
            : null,
      };

      return this.responseService.createResponse(
        HttpStatus.OK,
        { count, data: flightSearches, links },
        'Success',
      );
    } catch (error) {
      const newLog = await Log.create({
        level: '3',
        message: `INTERNAL_SERVER_ERROR Exception in generalTask/flightSearch GET Api, Error: ${
          error?.message || 'undefined'
        }`,
        meta: `generalTask/flightSearch GET Api`,
        timestamp: new Date().toISOString(),
      });
      return this.responseService.createResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        error?.message || 'undefined',
        EXCEPTION,
      );
    }
  }
  async getFlightSearchTemp(req): Promise<any> {
    try {
      let newLog = await Log.create({
        level: '3',
        message: `1) step generalTask/flightSearch GET Api,`,
        meta: `generalTask/flightSearch GET Api`,
        timestamp: new Date().toISOString(),
      });
      const whereOptions: any = {};
      // if (req.query.blogTypeId) {
      //   whereOptions.blogTypeId = req.query.blogTypeId;
      // }
      if (req.query.startDate && req.query.endDate) {
        // Both startDate and endDate provided
        whereOptions.searchDate = {
          [Op.between]: [req.query.startDate, req.query.endDate],
        };
      } else if (req.query.startDate) {
        // Only startDate provided
        whereOptions.searchDate = {
          [Op.gte]: req.query.startDate,
        };
      } else if (req.query.endDate) {
        // Only endDate provided
        whereOptions.searchDate = {
          [Op.lte]: req.query.endDate,
        };
      }
      newLog = await Log.create({
        level: '3',
        message: `2) step generalTask/flightSearch GET Api,`,
        meta: `generalTask/flightSearch GET Api`,
        timestamp: new Date().toISOString(),
      });
      // Pagination parameters
      const page = parseInt(req.query.pageNumber, 10) || 1;
      const pageSize = parseInt(req.query.pageSize, 10) || 10;
      const { count, rows: flightSearches } =
        await FlightSearches.findAndCountAll({
          where: whereOptions,
          include: [
            {
              model: FlightSearchesDetail,
            },
          ],
          order: [
            ['createdAt', 'DESC'], // Replace 'createdAt' with the column you want to sort by
          ],
          distinct: true,
          limit: pageSize,
          offset: (page - 1) * pageSize,
        });
      newLog = await Log.create({
        level: '3',
        message: `3) step generalTask/flightSearch GET Api,`,
        meta: `generalTask/flightSearch GET Api`,
        timestamp: new Date().toISOString(),
      });
      console.log('count', count);
      console.log('page', page);
      console.log('pageSize', pageSize);
      console.log('limit', pageSize);
      console.log('offset', (page - 1) * pageSize);
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const moment = require('moment-timezone');

      // flightSearches.forEach((search) => {
      //   search.searchDate = moment(search.searchDate)
      //     .tz('+05:00')
      //     .format('YYYY-MM-DD HH:mm:ss Z');
      // });
      newLog = await Log.create({
        level: '3',
        message: `4) step generalTask/flightSearch GET Api,`,
        meta: `generalTask/flightSearch GET Api`,
        timestamp: new Date().toISOString(),
      });
      const totalPages = Math.ceil(count / pageSize);

      const links = {
        first: `/generalTask/flightSearch?pageNumber=1&pageSize=${pageSize}`,
        last: `/generalTask/flightSearch?pageNumber=${totalPages}&pageSize=${pageSize}`,
        prev:
          page > 1
            ? `/generalTask/flightSearch?pageNumber=${
                page - 1
              }&pageSize=${pageSize}`
            : null,
        next:
          page < totalPages
            ? `/generalTask/flightSearch?pageNumber=${
                page + 1
              }&pageSize=${pageSize}`
            : null,
      };
      newLog = await Log.create({
        level: '3',
        message: `5) step generalTask/flightSearch GET Api,`,
        meta: `generalTask/flightSearch GET Api`,
        timestamp: new Date().toISOString(),
      });
      return this.responseService.createResponse(
        HttpStatus.OK,
        { count, data: flightSearches, links },
        'Success',
      );
    } catch (error) {
      const newLog = await Log.create({
        level: '3',
        message: `INTERNAL_SERVER_ERROR Exception in generalTask/flightSearch GET Api, Error: ${
          error?.message || 'undefined'
        }`,
        meta: `generalTask/flightSearch GET Api`,
        timestamp: new Date().toISOString(),
      });
      return this.responseService.createResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        error?.message || 'undefined',
        EXCEPTION,
      );
    }
  }
  async getLogs(req): Promise<any> {
    try {
      const whereOptions: any = {};
      if (req.query.level) {
        whereOptions.level = req.query.level;
      }
      if (req.query.startDate && req.query.endDate) {
        // Both startDate and endDate provided
        whereOptions.createdAt = {
          [Op.between]: [req.query.startDate, req.query.endDate],
        };
      } else if (req.query.startDate) {
        // Only startDate provided
        whereOptions.createdAt = {
          [Op.gte]: req.query.startDate,
        };
      } else if (req.query.endDate) {
        // Only endDate provided
        whereOptions.createdAt = {
          [Op.lte]: req.query.endDate,
        };
      }
      // Pagination parameters
      const page = parseInt(req.query.pageNumber, 10) || 1;
      const pageSize = parseInt(req.query.pageSize, 10) || 10;
      const { count, rows: data } = await Log.findAndCountAll({
        where: whereOptions,

        order: [
          ['createdAt', 'DESC'], // Replace 'createdAt' with the column you want to sort by
        ],
        distinct: true,
        limit: pageSize,
        offset: (page - 1) * pageSize,
      });

      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const moment = require('moment-timezone');

      const totalPages = Math.ceil(count / pageSize);

      const links = {
        first: `/generalTask/getLogs?pageNumber=1&pageSize=${pageSize}`,
        last: `/generalTask/getLogs?pageNumber=${totalPages}&pageSize=${pageSize}`,
        prev:
          page > 1
            ? `/generalTask/getLogs?pageNumber=${page - 1}&pageSize=${pageSize}`
            : null,
        next:
          page < totalPages
            ? `/generalTask/getLogs?pageNumber=${page + 1}&pageSize=${pageSize}`
            : null,
      };

      return this.responseService.createResponse(
        HttpStatus.OK,
        { count, data: data, links },
        'Success',
      );
    } catch (error) {
      const newLog = await Log.create({
        level: '3',
        message: `INTERNAL_SERVER_ERROR Exception in generalTask/flightSearch GET Api, Error: ${
          error?.message || 'undefined'
        }`,
        meta: `generalTask/flightSearch GET Api`,
        timestamp: new Date().toISOString(),
      });
      return this.responseService.createResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        error?.message || 'undefined',
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
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const moment = require('moment-timezone');

      const currentDateTimeGmt5 = moment()
        .tz('+05:00')
        .format('YYYY-MM-DD HH:mm:ss Z');

      // const currentDateTimeGmt5 = moment.tz('Asia/Karachi');
      // .format('YYYY-MM-DD HH:mm:ss');
      console.log('---currentDateTimeGmt5', currentDateTimeGmt5);
      // const timeZone = 'Asia/Karachi'; // Pakistan Standard Time
      const newFlightSearch = await FlightSearches.create(
        {
          tripType: payload.tripType,
          adults: payload.adults,
          children: payload.children,
          infants: payload.infants,
          classtype: payload.classtype,
          searchDate: currentDateTimeGmt5,
          // searchDate: new Date(),
          // searchDate: moment().tz(timeZone).toDate(),
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
      const newLog = await Log.create({
        level: '3',
        message: `INTERNAL_SERVER_ERROR Exception in generalTask/flightSearch POST Api, Error: ${
          error?.message || 'undefined'
        }`,
        meta: `generalTask/flightSearch POST Api`,
        timestamp: new Date().toISOString(),
      });
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
