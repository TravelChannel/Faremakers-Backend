/* eslint-disable @typescript-eslint/no-unused-vars */
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
  Req,
  Query,
  // Test Commit
  // HttpException,
} from '@nestjs/common';

import { SkipAuth } from '../../../common/decorators/skip-auth.decorator';

import { GeneralTasksService } from './generalTasks.service';
import {
  ADMIN_SUBJECT,
  //  ADMIN_AND_USER_SUBJECT
} from 'src/common/aclSubjects';
// import { ToggleIsActiveDto } from 'src/shared/dtos/toggleIsActive.dto';
// Test commit
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';

@Controller('generalTask')
@UseGuards(RolesGuard)
@Roles(ADMIN_SUBJECT)
export class GeneralTasksController {
  constructor(private readonly generalTaskService: GeneralTasksService) {}

  @Get('dropdown')
  getDropdown() {
    return this.generalTaskService.getDropdown();
  }
}
