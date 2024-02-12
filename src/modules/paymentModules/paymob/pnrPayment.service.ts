import { Injectable, Inject, HttpStatus } from '@nestjs/common';
import { PNRPAYMENT_REPOSITORY } from '../../../shared/constants';
import { PnrPayment } from './entities/pnrPayment.entity';
import { sequelize, Transaction } from '../../../database/sequelize.provider'; // Adjust the path accordingly
import { ResponseService } from '../../../common/utility/response/response.service';
import { EXCEPTION } from '../../../shared/messages.constants';
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
      const promotion = await this.pnrPaymentRepository.findAll();
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
      const promotion = await this.pnrPaymentRepository.findByPk(id, {});
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
}
