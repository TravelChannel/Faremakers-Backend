import { Injectable, Inject, HttpStatus } from '@nestjs/common';
import { PNRPAYMENT_REPOSITORY } from 'src/shared/constants';
import { PnrPayment } from './entities/pnrPayment.entity';
import { sequelize, Transaction } from 'src/database/sequelize.provider'; // Adjust the path accordingly
import { ResponseService } from 'src/common/utility/response/response.service';
import { EXCEPTION } from 'src/shared/messages.constants';
import { PnrBooking } from 'src/modules/pnr/pnrBooking/entities/pnrBooking.entity';
// import { ToggleIsActiveDto } from 'src/shared/dtos/toggleIsActive.dto';

@Injectable()
export class PnrPaymentService {
  constructor(
    @Inject(PNRPAYMENT_REPOSITORY)
    private pnrPaymentRepository: typeof PnrPayment,
    private readonly responseService: ResponseService,
  ) {}

  async create() {
    const t: Transaction = await sequelize.transaction();

    try {
      // const { ...rest } = createPromotionDto;

      // const newRole = await this.pnrPaymentRepository.create(
      //   { title: rest.title, description: rest.description },
      //   { transaction: t },
      // );

      await t.commit();

      return this.responseService.createResponse(
        HttpStatus.OK,
        {},
        'PnrPayment Added',
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

  async findAll(): Promise<PnrPayment[]> {
    try {
      const pnrPayment = await this.pnrPaymentRepository.findAll({
        include: [
          {
            model: PnrBooking,
          },
        ],
      });
      return this.responseService.createResponse(
        HttpStatus.OK,
        pnrPayment,
        'pnrPayment Fetched',
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

  async byBookingId(id: string) {
    try {
      const pnrPayment = await this.pnrPaymentRepository.findAll({
        where: {
          pnrBookingId: id,
        },
        include: [
          {
            model: PnrBooking,
          },
        ],
      });
      return this.responseService.createResponse(
        HttpStatus.OK,
        pnrPayment,
        'pnrPayment retrieved successfully',
      );
    } catch (error) {
      return this.responseService.createResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        null,
        error.message,
      );
    }
  }
  async findByPnr(id: string) {
    try {
      const pnrPayment = await this.pnrPaymentRepository.findAll({
        include: [
          {
            model: PnrBooking,
            where: {
              pnr: id,
            },
          },
        ],
      });
      return this.responseService.createResponse(
        HttpStatus.OK,
        pnrPayment,
        'pnrPayment retrieved successfully',
      );
    } catch (error) {
      return this.responseService.createResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        null,
        error.message,
      );
    }
  }
  async findOne(id: number) {
    try {
      const pnrPayment = await this.pnrPaymentRepository.findByPk(id, {});
      return this.responseService.createResponse(
        HttpStatus.OK,
        pnrPayment,
        'pnrPayment retrieved successfully',
      );
    } catch (error) {
      return this.responseService.createResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        null,
        error.message,
      );
    }
  }
}
