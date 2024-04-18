import { Injectable, Inject, HttpStatus } from '@nestjs/common';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { PROMOTIONS_REPOSITORY } from '../../../shared/constants';
import { Promotion } from './entities/promotion.entity';
import { FirebaseService } from '../../../database/firebase/firebase.service';

import {
  Op,
  sequelize,
  Transaction,
} from '../../../database/sequelize.provider'; // Adjust the path accordingly
import { ResponseService } from '../../../common/utility/response/response.service';
import { EXCEPTION } from '../../../shared/messages.constants';
// import { ToggleIsActiveDto } from 'src/shared/dtos/toggleIsActive.dto';

@Injectable()
export class PromotionsService {
  constructor(
    @Inject(PROMOTIONS_REPOSITORY)
    private promotionsRepository: typeof Promotion,
    private readonly responseService: ResponseService,
    private readonly firebaseService: FirebaseService,
  ) {}

  async create(
    createPromotionDto: CreatePromotionDto,

    imgFile: Express.Multer.File,
  ) {
    const t: Transaction = await sequelize.transaction();

    try {
      const { ...rest } = createPromotionDto;
      let myImg = null;
      if (imgFile) {
        myImg = await this.firebaseService.uploadFile(imgFile, 'blogs');
      }
      const newRole = await this.promotionsRepository.create(
        {
          title: rest.title,
          description: rest.description,
          startDate: rest.startDate ?? null,
          endDate: rest.endDate ?? null,
          img: myImg,
        },
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
      const currentDate = new Date();

      const promotion = await this.promotionsRepository.findAll({
        where: {
          isActive: true,
          [Op.and]: [
            {
              startDate: {
                [Op.or]: {
                  [Op.lte]: currentDate,
                  [Op.is]: null, // Check for null start date
                },
              },
            },
            {
              endDate: {
                [Op.or]: {
                  [Op.gte]: currentDate,
                  [Op.is]: null, // Check for null end date
                },
              },
            },
          ],
        },
      });

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
  async update(
    id: number,
    updatePromotionDto: UpdatePromotionDto,
    imgFile: Express.Multer.File,
  ) {
    const t = await sequelize.transaction(); // Start the transaction

    try {
      const promotion = await this.promotionsRepository.findByPk(id);
      let myImg = updatePromotionDto.img;
      if (imgFile) {
        if (promotion.img) {
          // await this.firebaseService.deleteFile(promotion.img);
        }
        myImg = await this.firebaseService.uploadFile(imgFile, 'blogs');
      }
      if (promotion) {
        promotion.title = updatePromotionDto.title;
        promotion.description = updatePromotionDto.description;
        promotion.startDate = updatePromotionDto.startDate ?? null;
        promotion.endDate = updatePromotionDto.endDate ?? null;
        promotion.img = myImg;
        await promotion.save();
      } else {
        return this.responseService.createResponse(
          HttpStatus.NOT_FOUND,
          null,
          'Promotion Not Found',
        );
      }
      t.commit();
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

      const promotion = await this.promotionsRepository.findOne({
        where: whereOptions,
      });
      if (!promotion) {
        return this.responseService.createResponse(
          HttpStatus.NOT_FOUND,
          null,
          'Record not found',
        );
      }

      promotion.isActive = !promotion.isActive;

      await promotion.save({ transaction: t }); // Save the changes
      await t.commit();
      let message = '';
      if (promotion.isActive || false === false) {
        message = 'Promotion deactivated successfully';
      } else {
        message = 'Promotion activated successfully';
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
