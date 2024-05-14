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
  Put,
  Res,
  // Test Commit
  // HttpException,
} from '@nestjs/common';
import * as xmlbuilder from 'xmlbuilder';

import { SkipAuth } from '../../../common/decorators/skip-auth.decorator';
import * as moment from 'moment';
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
import { staticData } from './staticData';

@Controller('generalTask')
@UseGuards(RolesGuard)
@Roles(ADMIN_SUBJECT)
export class GeneralTasksController {
  constructor(private readonly generalTaskService: GeneralTasksService) {}

  @SkipAuth()
  @Get('')
  async getXml(@Res() res) {
    const blogs = await Blog.findAll(); // Assuming findAll is implemented in your service

    const xml = xmlbuilder.create('urlset');

    // Set xmlns and xmlns:xsi attributes separately
    xml.att('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9');
    xml.att('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance');
    xml.att(
      'xsi:schemaLocation',
      'http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd',
    );

    // Add URLs from staticData
    staticData.url.forEach((urlData) => {
      xml
        .ele('url')
        .ele('loc', urlData.loc)
        .up()
        .ele('lastmod', urlData.lastmod)
        .up()
        .ele('priority', urlData.priority);
    });
    // Add URLs from blogs
    blogs.forEach((blog) => {
      xml
        .ele('url')
        .ele('loc', `https://faremakers.com/blogs/${blog.headerUrl}`)
        .up()
        .ele(
          'lastmod',
          moment(blog.updatedAt).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
        ) // Format the date using moment
        .up()
        .ele('priority', '0.85'); // Priority can be set according to your logic
    });

    const xmlString = xml.end({ pretty: true });

    res.set('Content-Type', 'application/xml');
    res.send(xmlString);
  }

  @Get('dropdown')
  getDropdown() {
    return this.generalTaskService.getDropdown();
  }
  @Get('getIsSabreCreateTicketAllowed')
  getIsSabreCreateTicketAllowed() {
    return this.generalTaskService.getIsSabreCreateTicketAllowed();
  }
  @Get('getAllControls')
  getAllControls() {
    return this.generalTaskService.getAllControls();
  }
  @SkipAuth()
  @Put('flightSearch')
  flightSearch(@Body() payload: any) {
    return this.generalTaskService.flightSearch(payload);
  }
  @Patch('toggleStatus/:id')
  toggleStatus(
    @Param('id') id: string,
    // @Body() toggleIsActiveDto: ToggleIsActiveDto,
  ) {
    return this.generalTaskService.toggleStatus(+id);
  }
}
