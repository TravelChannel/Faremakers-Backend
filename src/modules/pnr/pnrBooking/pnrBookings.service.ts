import { Injectable, Inject, HttpStatus } from '@nestjs/common';
import { PnrBookingDto } from './dto/create-pnrBooking.dto';
// import { PnrBookingArrayDto } from './dto/PnrBookingArray.dto';
// import { UpdateVoucherDto } from './dto/update-vouchers.dto';
import { SAVED_SUCCESS, GET_SUCCESS } from '../../../shared/messages.constants';
import { PNR_BOOKINGS_REPOSITORY } from '../../../shared/constants';
import { PnrBooking } from './entities/pnrBooking.entity';
import { PnrDetails } from '../pnrDetails';
import { PnrUser } from '../pnrUsers';
import { sequelize, Transaction } from '../../../database/sequelize.provider'; // Adjust the path accordingly
import { ResponseService } from '../../../common/utility/response/response.service';
//  // import { EXCEPTION } from '../../../shared/messages.constants';
@Injectable()
export class PnrBookingsService {
  constructor(
    @Inject(PNR_BOOKINGS_REPOSITORY)
    private pnrBookingRepository: typeof PnrBooking,
    private readonly responseService: ResponseService,
  ) {}
  async create(pnrBookingDto: PnrBookingDto): Promise<any> {
    const t: Transaction = await sequelize.transaction();
    try {
      const { pnrBookings, pnr, phoneNumber } = pnrBookingDto;
      let pnrUser = await PnrUser.findOne({
        where: {
          phoneNumber: phoneNumber,
        },
      });
      if (!pnrUser) {
        pnrUser = await PnrUser.create(
          {
            phoneNumber: phoneNumber,
          },
          { transaction: t },
        );
      }

      const newPnrBookingRepository = await this.pnrBookingRepository.create(
        {
          pnrUserId: pnrUser.id,
          pnr: pnr,
        },
        { transaction: t },
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars

      if (pnrBookings.length > 0) {
        await Promise.all(
          pnrBookings.map(async (pnrBooking) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const newPnrDetails = await PnrDetails.create(
              {
                pnrBookingId: newPnrBookingRepository.id,
                phoneNumber: pnrBooking.phoneNumber,
                userEmail: pnrBooking.userEmail,
                dateOfBirth: pnrBooking.dateOfBirth,
                passportExpiryDate: pnrBooking.passportExpiryDate,
                firstName: pnrBooking.firstName,
                lastName: pnrBooking.lastName,
                gender: pnrBooking.gender,
                cnic: pnrBooking.cnic,
                passportNo: pnrBooking.passportNo,
              },
              { transaction: t },
            );
          }),
        );
      }

      await t.commit();
      return this.responseService.createResponse(
        HttpStatus.OK,
        newPnrBookingRepository,
        SAVED_SUCCESS,
      );
    } catch (error) {
      console.log('Error', error.message);
      await t.rollback();
      return this.responseService.createResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        null,
        error.message,
      );
    }
  }
  async findAll(): Promise<any> {
    try {
      const users = await PnrUser.findAll({
        include: [
          {
            model: PnrBooking,
          },
        ],
      });
      console.log('doneeee');
      return this.responseService.createResponse(
        HttpStatus.OK,
        users,
        // { userFromSession, users },
        GET_SUCCESS,
      );
    } catch (error) {
      console.log(error);
      return this.responseService.createResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        null,
        error.message,
      );
    }
  }
  async findOne(id: string): Promise<any> {
    try {
      const user = await PnrUser.findByPk(id, {
        include: [
          {
            model: PnrBooking,
          },
        ],
      });
      if (!user) {
        return this.responseService.createResponse(
          HttpStatus.NOT_FOUND,
          null,
          'Record Not Found',
        );
      }
      return this.responseService.createResponse(
        HttpStatus.OK,
        user,
        GET_SUCCESS,
      );
    } catch (error) {
      console.log(error);
      return this.responseService.createResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        null,
        error.message,
      );
    }
  }
  async findBy(req): Promise<any> {
    try {
      console.log('req', req.query);
      const whereOptions: any = {};
      if (req.query.cnic) {
        whereOptions.cnic = req.query.cnic;
      } else if (req.query.passportNo) {
        whereOptions.passportNo = req.query.passportNo;
      } else if (req.query.phoneNumber) {
        whereOptions.phoneNumber = req.query.phoneNumber;
      } else if (req.query.userEmail) {
        whereOptions.userEmail = req.query.userEmail;
      } else {
        return this.responseService.createResponse(
          HttpStatus.NOT_FOUND,
          null,
          'Please provide search parameter.',
        );
      }

      console.log('ddddddwhereOptions', whereOptions);
      const users = await PnrUser.findOne({
        where: whereOptions,
        include: [
          {
            model: PnrBooking,
          },
        ],
      });
      if (users) {
        return this.responseService.createResponse(
          HttpStatus.OK,
          users,
          // { userFromSession, users },
          GET_SUCCESS,
        );
      } else {
        return this.responseService.createResponse(
          HttpStatus.NOT_FOUND,
          null,
          'Record Not Found',
        );
      }
    } catch (error) {
      console.log(error);
      return this.responseService.createResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        null,
        error.message,
      );
    }
  }
}
