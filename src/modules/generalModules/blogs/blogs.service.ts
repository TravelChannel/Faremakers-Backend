import { Injectable, Inject, HttpStatus } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { BLOGS_REPOSITORY } from '../../../shared/constants';
import { Blog } from './entities/blog.entity';
import { sequelize, Transaction } from '../../../database/sequelize.provider'; // Adjust the path accordingly
import { ResponseService } from '../../../common/utility/response/response.service';
import { EXCEPTION } from '../../../shared/messages.constants';
// import { ToggleIsActiveDto } from 'src/shared/dtos/toggleIsActive.dto';

@Injectable()
export class BlogsService {
  constructor(
    @Inject(BLOGS_REPOSITORY)
    private blogsRepository: typeof Blog,
    private readonly responseService: ResponseService,
  ) {}

  async create(createBlogDto: CreateBlogDto) {
    const t: Transaction = await sequelize.transaction();

    try {
      const { ...rest } = createBlogDto;

      const newRole = await this.blogsRepository.create(
        { title: rest.title, description: rest.description },
        { transaction: t },
      );

      await t.commit();

      return this.responseService.createResponse(
        HttpStatus.OK,
        newRole,
        'Blog Added',
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

  async findAll(): Promise<Blog[]> {
    try {
      const blog = await this.blogsRepository.findAll();
      return this.responseService.createResponse(
        HttpStatus.OK,
        blog,
        'blog Fetched',
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
      const blog = await this.blogsRepository.findByPk(id, {});
      return this.responseService.createResponse(
        HttpStatus.OK,
        blog,
        'blog retrieved successfully',
      );
    } catch (error) {
      return this.responseService.createResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        null,
        error.message,
      );
    }
  }

  async update(id: number, updateBlogDto: UpdateBlogDto) {
    const t = await sequelize.transaction(); // Start the transaction

    try {
      const blog = await this.blogsRepository.findByPk(id);
      if (blog) {
        blog.title = updateBlogDto.title;
        blog.description = updateBlogDto.description;
        await blog.save();
      } else {
        return this.responseService.createResponse(
          HttpStatus.NOT_FOUND,
          null,
          'Blog Not Found',
        );
      }
      t.commit();
      return this.responseService.createResponse(
        HttpStatus.OK,
        null,
        'Blog updated successfully',
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
      const blog = await this.blogsRepository.findByPk(id);
      if (!blog) {
        return this.responseService.createResponse(
          HttpStatus.NOT_FOUND,
          null,
          'blog not found',
        );
      }

      await blog.destroy({ transaction: t });
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
      const dropdownsArray = await this.blogsRepository.findAll({
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

      const blog = await this.blogsRepository.findOne({
        where: whereOptions,
      });
      if (!blog) {
        return this.responseService.createResponse(
          HttpStatus.NOT_FOUND,
          null,
          'Record not found',
        );
      }

      blog.isActive = !blog.isActive;

      await blog.save({ transaction: t }); // Save the changes
      await t.commit();
      let message = '';
      if (blog.isActive || false === false) {
        message = 'Blog deactivated successfully';
      } else {
        message = 'Blog activated successfully';
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
