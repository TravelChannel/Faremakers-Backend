import { Injectable, Inject, HttpStatus } from '@nestjs/common';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { RATINGS_REPOSITORY } from '../../../shared/constants';
import { Rating } from './entities/rating.entity';
import { sequelize, Transaction } from '../../../database/sequelize.provider'; // Adjust the path accordingly
import { ResponseService } from '../../../common/utility/response/response.service';
import { EXCEPTION } from '../../../shared/messages.constants';
// import { ToggleIsActiveDto } from 'src/shared/dtos/toggleIsActive.dto';

@Injectable()
export class RatingsService {
  constructor(
    @Inject(RATINGS_REPOSITORY)
    private ratingsRepository: typeof Rating,
    private readonly responseService: ResponseService,
  ) {}

  async create(createRatingDto: CreateRatingDto) {
    const t: Transaction = await sequelize.transaction();

    try {
      const { ...rest } = createRatingDto;

      const newRole = await this.ratingsRepository.create(
        {
          title: rest.title,
          review: rest.review,
          stars: rest.stars,
        },
        { transaction: t },
      );

      await t.commit();

      return this.responseService.createResponse(
        HttpStatus.OK,
        newRole,
        'Rating Added',
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

  async findAll(): Promise<Rating[]> {
    try {
      const rating = await this.ratingsRepository.findAll({
        where: {
          isActive: true,
        },
      });
      return this.responseService.createResponse(
        HttpStatus.OK,
        rating,
        'rating Fetched',
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
  async findAllForAdmin(): Promise<Rating[]> {
    try {
      const rating = await this.ratingsRepository.findAll({
        // where: {
        //   isActive: true,
        // },
      });
      return this.responseService.createResponse(
        HttpStatus.OK,
        rating,
        'rating Fetched',
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
      const rating = await this.ratingsRepository.findByPk(id, {});
      return this.responseService.createResponse(
        HttpStatus.OK,
        { ...rating.toJSON() },
        'rating retrieved successfully',
      );
    } catch (error) {
      return this.responseService.createResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        null,
        error.message,
      );
    }
  }

  async update(id: number, updateRatingDto: UpdateRatingDto) {
    const t = await sequelize.transaction(); // Start the transaction

    try {
      const rating = await this.ratingsRepository.findByPk(id);
      if (rating) {
        rating.title = updateRatingDto.title;
        rating.review = updateRatingDto.review;
        rating.stars = updateRatingDto.stars;

        await rating.save();
      } else {
        return this.responseService.createResponse(
          HttpStatus.NOT_FOUND,
          null,
          'Rating Not Found',
        );
      }
      t.commit();
      return this.responseService.createResponse(
        HttpStatus.OK,
        null,
        'Rating updated successfully',
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
      const rating = await this.ratingsRepository.findByPk(id);
      if (!rating) {
        return this.responseService.createResponse(
          HttpStatus.NOT_FOUND,
          null,
          'rating not found',
        );
      }

      await rating.destroy({ transaction: t });
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
      const dropdownsArray = await this.ratingsRepository.findAll({
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

      const rating = await this.ratingsRepository.findOne({
        where: whereOptions,
      });
      if (!rating) {
        return this.responseService.createResponse(
          HttpStatus.NOT_FOUND,
          null,
          'Record not found',
        );
      }

      rating.isActive = !rating.isActive;

      await rating.save({ transaction: t }); // Save the changes
      await t.commit();
      let message = '';
      if (rating.isActive || false === false) {
        message = 'Rating deactivated successfully';
      } else {
        message = 'Rating activated successfully';
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
