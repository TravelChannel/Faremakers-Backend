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
  Res,
  // Test Commit
  // HttpException,
} from '@nestjs/common';
import * as xmlbuilder from 'xmlbuilder';

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
import { Blog } from '../blogs/entities/blog.entity';

@Controller('generalTask')
@UseGuards(RolesGuard)
@Roles(ADMIN_SUBJECT)
export class GeneralTasksController {
  constructor(private readonly generalTaskService: GeneralTasksService) {}

  @SkipAuth()
  @Get('')
  async getXml2(@Res() res) {
    const blogs = await Blog.findAll(); // Assuming findAll is implemented in your service

    const xml = xmlbuilder.create('urlset', {});

    blogs.forEach((blog) => {
      xml
        .ele('url')
        .ele(
          'loc',
          `${process.env.BASE_URL}:${process.env.PORT}/blogs/${blog.headerUrl}`,
        )
        .up()
        .ele('lastmod', blog.updatedAt) // Assuming you want to use updatedAt for last modified date
        .up()
        .ele('priority', '0.85'); // Priority can be set according to your logic
    });

    const xmlString = xml.end({ pretty: true });

    res.set('Content-Type', 'application/xml');
    res.send(xmlString);
  }
  @Get('iii')
  async getXml(@Res() res) {
    const blogs = await Blog.findAll({});
    const xml = xmlbuilder
      .create('response')
      .ele('message', 'Hello, XML!')
      .end({ pretty: true });

    res.set('Content-Type', 'application/xml');
    res.send(xml);
  }
  @Get('dropdown')
  getDropdown() {
    return this.generalTaskService.getDropdown();
  }
}
