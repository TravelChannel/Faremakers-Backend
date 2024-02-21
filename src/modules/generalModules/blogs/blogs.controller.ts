import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  HttpStatus,
  ParseFilePipeBuilder,
  UploadedFile,

  // HttpException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { createFileStorage } from '../../../common/utils/file-storage.util'; // Import the utility function

import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { ADMIN_SUBJECT } from 'src/common/aclSubjects';
// import { ToggleIsActiveDto } from 'src/shared/dtos/toggleIsActive.dto';

import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';

@Controller('blogs')
@UseGuards(RolesGuard)
@Roles(ADMIN_SUBJECT)
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('imgFile', {
      storage: createFileStorage('./uploads/blogs/images'),
    }),
  )
  async create(
    @Body() payload: { data: string },

    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'jpeg|png',
        })

        .addMaxSizeValidator({
          maxSize: 5000000,
          // errorMessage: 'File size should not exceed 1MB',
        })
        .build({
          fileIsRequired: false,
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    imgFile?: Express.Multer.File | null | undefined,
  ) {
    console.log('payload', payload);
    const createBlogDto: CreateBlogDto = JSON.parse(payload.data);

    return await this.blogsService.create(createBlogDto, imgFile);
  }

  @Get('dropdown')
  // @Roles(SUPERADMIN_ALL_COMPANIES_ADMIN_SUBJECT)
  getDropdown() {
    return this.blogsService.getDropdown();
  }

  @Get()
  findAll() {
    return this.blogsService.findAll();
  }

  // @Get(':id')
  // findOneByTitle(@Param('id') id: string) {
  //   return this.blogsService.findOneByTitle(+id);
  // }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogsService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('imgFile', {
      storage: createFileStorage('./uploads/blogs/images'),
    }),
  )
  update(
    @Param('id') id: string,
    @Body() payload: { data: string },

    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'jpeg|png',
        })

        .addMaxSizeValidator({
          maxSize: 5000000,
          // errorMessage: 'File size should not exceed 1MB',
        })
        .build({
          fileIsRequired: false,
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    imgFile?: Express.Multer.File | null | undefined,
  ) {
    const updateBlogDto: UpdateBlogDto = JSON.parse(payload.data);

    return this.blogsService.update(+id, updateBlogDto, imgFile);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blogsService.remove(+id);
  }
  @Patch('toggleStatus/:id')
  toggleStatus(
    @Param('id') id: string,
    // @Body() toggleIsActiveDto: ToggleIsActiveDto,
  ) {
    return this.blogsService.toggleStatus(+id);
  }
}
