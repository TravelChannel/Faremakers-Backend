import { Injectable, Inject, HttpStatus } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { BLOGS_REPOSITORY } from '../../../shared/constants';
import { Blog } from './entities/blog.entity';
import { sequelize, Transaction } from '../../../database/sequelize.provider'; // Adjust the path accordingly
import { ResponseService } from '../../../common/utility/response/response.service';
import { EXCEPTION } from '../../../shared/messages.constants';
import { FirebaseService } from '../../../database/firebase/firebase.service';
// import { ToggleIsActiveDto } from 'src/shared/dtos/toggleIsActive.dto';

import { BlogTypes } from '../blogTypes/index';

@Injectable()
export class BlogsService {
  constructor(
    @Inject(BLOGS_REPOSITORY)
    private blogsRepository: typeof Blog,
    private readonly responseService: ResponseService,
    private readonly firebaseService: FirebaseService,
  ) {}

  async create(
    createBlogDto: CreateBlogDto,

    imgFile: Express.Multer.File,
  ) {
    const t: Transaction = await sequelize.transaction();

    try {
      let myImg = null;
      if (imgFile) {
        myImg = await this.firebaseService.uploadFile(imgFile, 'blogs');
      }
      const newBlog = await this.blogsRepository.create(
        {
          mainTitle: createBlogDto.mainTitle,
          description: createBlogDto.description,
          shortDescription: createBlogDto.shortDescription,
          headerUrl: createBlogDto.headerUrl,
          author: createBlogDto.author,
          blogTypeId: createBlogDto.blogTypeId,

          img: myImg,
        },
        { transaction: t },
      );

      await t.commit();

      return this.responseService.createResponse(
        HttpStatus.OK,
        newBlog,
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

  async findAllPaginated(req): Promise<{ blogs: Blog[] }> {
    try {
      const whereOptions: any = {};
      if (req.query.blogTypeId) {
        whereOptions.blogTypeId = req.query.blogTypeId;
      }

      // Pagination parameters
      const page = parseInt(req.query.pageNumber, 10) || 1;
      const pageSize = parseInt(req.query.pageSize, 10) || 10;

      const { count, rows: blogs } = await this.blogsRepository.findAndCountAll(
        {
          where: whereOptions,
          attributes: { exclude: ['description'] },
          order: [['publishDate', 'DESC']],
          limit: pageSize,
          offset: (page - 1) * pageSize,
        },
      );

      const totalPages = Math.ceil(count / pageSize);

      const links = {
        first: `/blogs?page=1&pageSize=${pageSize}`,
        last: `/blogs?page=${totalPages}&pageSize=${pageSize}`,
        prev: page > 1 ? `/blogs?page=${page - 1}&pageSize=${pageSize}` : null,
        next:
          page < totalPages
            ? `/blogs?page=${page + 1}&pageSize=${pageSize}`
            : null,
      };
      return this.responseService.createResponse(
        HttpStatus.OK,
        { count, blogs, links },
        'Blogs Fetched',
      );
    } catch (error) {
      return this.responseService.createResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        null,
        EXCEPTION,
      );
    }
  }
  async findAll(
    pageNumber: number = 1,
    pageSize: number = 10,
    req,
  ): Promise<{ blogs: Blog[]; hasNextPage: boolean }> {
    try {
      const whereOptions: any = {};
      if (req.query.blogTypeId) {
        whereOptions.blogTypeId = req.query.blogTypeId;
      }
      const offset = (pageNumber - 1) * pageSize;
      const blogs = await this.blogsRepository.findAll({
        where: whereOptions,
        attributes: { exclude: ['description'] },
        order: [['publishDate', 'DESC']], // Assuming you want to order by publishDate descending
        limit: pageSize,
        offset: offset,
      });

      const nextBlogs = await this.blogsRepository.findAll({
        where: whereOptions,
        attributes: { exclude: ['description'] },
        order: [['publishDate', 'DESC']],
        limit: pageSize,
        offset: offset + pageSize,
      });

      const hasNextPage = nextBlogs.length > 0;

      return this.responseService.createResponse(
        HttpStatus.OK,
        { blogs, hasNextPage },
        'Blogs Fetched',
      );
    } catch (error) {
      return this.responseService.createResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        null,
        EXCEPTION,
      );
    }
  }

  async findOneBy(req) {
    try {
      const whereOptions: any = {};
      if (req.query.mainTitle) {
        whereOptions.mainTitle = req.query.mainTitle;
      }
      if (req.query.headerUrl) {
        whereOptions.headerUrl = req.query.headerUrl;
      }
      const blog = await this.blogsRepository.findOne({
        where: whereOptions,
      });
      if (blog) {
        return this.responseService.createResponse(
          HttpStatus.OK,
          blog,
          'blog retrieved successfully',
        );
      } else {
        return this.responseService.createResponse(
          HttpStatus.OK,
          null,
          'no blog found.',
        );
      }
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

  async update(
    id: number,
    updateBlogDto: UpdateBlogDto,
    imgFile: Express.Multer.File,
  ) {
    const t = await sequelize.transaction(); // Start the transaction

    try {
      let myImg = updateBlogDto.img;
      if (imgFile) {
        const imagePath =
          process.env.BASE_URL +
          ':' +
          process.env.PORT +
          '/uploads/blogs/images/' +
          imgFile.filename;
        myImg = imagePath; // Store the file path in the user table
      }
      const existingBlog = await this.blogsRepository.findByPk(id, {
        // include: [{ model: BlogsDetails }],
      });
      if (!existingBlog) {
        return this.responseService.createResponse(
          HttpStatus.NOT_FOUND,
          null,
          'Blog not found',
        );
      }

      // Update the role details
      await existingBlog.update(
        {
          mainTitle: updateBlogDto.mainTitle,
          description: updateBlogDto.description,
          shortDescription: updateBlogDto.shortDescription,
          headerUrl: updateBlogDto.headerUrl,
          author: updateBlogDto.author,
          blogTypeId: updateBlogDto.blogTypeId,

          img: myImg,
        },
        { transaction: t },
      );

      // Steps 2 to 5: Handle blog details updates
      // const existingDetails = await BlogsDetails.findAll({
      //   where: { blogId: blogId },
      //   transaction: t,
      // });

      // Determine changes
      // const updateBlogDetailsIds = updateBlogDto.content
      //   .map((detail) => detail.id)
      //   .filter((id) => id !== undefined);
      // const newBlogDetails = updateBlogDto.content.filter(
      //   (detail) => !detail.id,
      // );
      // const detailsToDelete = existingDetails.filter(
      //   (detail) => !updateBlogDetailsIds.includes(detail.id),
      // );
      // const detailsToUpdate = updateBlogDto.content.filter(
      //   (detail) => detail.id,
      // );

      // Delete, add, and update details as necessary
      // await Promise.all([
      //   ...detailsToDelete.map((detail) =>
      //     BlogsDetails.destroy({ where: { id: detail.id }, transaction: t }),
      //   ),
      // ...newBlogDetails.map((element) =>
      //   BlogsDetails.create(
      //     { blogId: blogId, ...element },
      //     { transaction: t },
      //   ),
      // ),
      // ...detailsToUpdate.map((element) =>
      //   BlogsDetails.update(
      //     { ...element },
      //     { where: { id: element.id }, transaction: t },
      //   ),
      // ),
      // ]);
      await t.commit();
      return this.responseService.createResponse(
        HttpStatus.OK,
        null,
        'Blog updated successfully',
      );
    } catch (error) {
      console.log('errorrr', error);

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
          'blog not found.',
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
  async getTypesDropdown() {
    try {
      const dropdownsArray = await BlogTypes.findAll({
        attributes: ['id', 'name'],
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
