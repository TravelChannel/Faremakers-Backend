import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  ParseFilePipeBuilder,
  UploadedFile,
  UseInterceptors,

  // HttpException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { PromotionsService } from './promotions.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { ADMIN_SUBJECT } from 'src/common/aclSubjects';
// import { ToggleIsActiveDto } from 'src/shared/dtos/toggleIsActive.dto';

import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { SkipAuth } from '../../../common/decorators/skip-auth.decorator';

@Controller('promotions')
@UseGuards(RolesGuard)
@Roles(ADMIN_SUBJECT)
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('imgFile'))
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
    const createPromotionDto: CreatePromotionDto = JSON.parse(payload.data);
    return await this.promotionsService.create(createPromotionDto, imgFile);
  }
  @Get('dropdown')
  getDropdown() {
    return this.promotionsService.getDropdown();
  }

  @Get()
  @SkipAuth()
  // @Roles(ADMIN_AND_USER_SUBJECT)
  findAll() {
    return this.promotionsService.findAll();
  }

  @Get(':id')
  @SkipAuth()
  findOne(@Param('id') id: string) {
    return this.promotionsService.findOne(+id);
  }

  @UseInterceptors(FileInterceptor('imgFile'))
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
    const updatePromotionDto: UpdatePromotionDto = JSON.parse(payload.data);

    return this.promotionsService.update(+id, updatePromotionDto, imgFile);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.promotionsService.remove(+id);
  }
  @Patch('toggleStatus/:id')
  toggleStatus(
    @Param('id') id: string,
    // @Body() toggleIsActiveDto: ToggleIsActiveDto,
  ) {
    return this.promotionsService.toggleStatus(+id);
  }
}
