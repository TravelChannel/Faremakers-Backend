/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  HttpStatus,
  ParseFilePipeBuilder,
  FileTypeValidator,
  ParseFilePipe,
  MaxFileSizeValidator,
  // HttpException,
  // UseGuards,
  Req,
  Patch,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  // Session,
} from '@nestjs/common';
import { createFileStorage } from '../../../common/utils/file-storage.util'; // Import the utility function
import { extname } from 'path';
import { diskStorage } from 'multer';
import { CurrentUserId } from 'src/common/decorators/currentUserId.decorator';
import { CurrentCompanyId } from 'src/common/decorators/currentCompanyId.decorator';
// import { Express } from 'express';
// import { SessionData } from 'express-session';
import { FileInterceptor } from '@nestjs/platform-express';

import { AuthGuard } from '../../../common/guards/auth.guard';

import { CreateUserDto } from './dto/create-user.dto';
import { AssignRolesToUserDto } from './dto/assignRolesToUser.dto';
import { UpdateUserDto } from './dto/UpdateUser.dto';
import { ToggleIsActiveDto } from 'src/shared/dtos/toggleIsActive.dto';

import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import {
  SUPERADMIN_ALL_COMPANIES_ADMIN_SUBJECT,
  PUBLIC_SUBJECT,
} from 'src/common/aclSubjects';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RolesGuard } from '../../../common/guards/roles.guard';

@Controller('users')
@UseGuards(RolesGuard)
@Roles(SUPERADMIN_ALL_COMPANIES_ADMIN_SUBJECT)
export class PnrUsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('createUser')
  async createUser(
    @CurrentCompanyId() currentCompanyId: number,
    @Body() createUserDto: CreateUserDto,
  ) {
    return await this.usersService.create(currentCompanyId, createUserDto);
  }
  // @Post('createUserTemp')
  // async createTemp(@Body() data: any) {
  //   try {
  //     return await this.usersService.createTempRecent(data);
  //   } catch (error) {
  //     console.log('eeeee', error);
  //   }
  // }

  @Get()
  findAll(
    @CurrentCompanyId() currentCompanyId: number,
    @Req() req: Request,
  ): Promise<User[]> {
    return this.usersService.findAll(currentCompanyId, req);
  }

  @Get('me')
  @Roles(PUBLIC_SUBJECT)
  async getCurrentUser(@CurrentUserId() currentUserId: string): Promise<User> {
    return this.usersService.findMe(currentUserId);
  }
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Post(':id')
  @UseInterceptors(
    FileInterceptor('imgFile', {
      storage: createFileStorage('./uploads/users/profiles'),
    }),
  )
  update(
    @Param('id') id: string,
    @CurrentUserId() currentUserId: number,
    @CurrentCompanyId() currentCompanyId: number,
    @Body() payload: { data: string },
    // @UploadedFile(
    //   new ParseFilePipe({
    //     validators: [
    //       new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
    //       new MaxFileSizeValidator({ maxSize: 1000000 }),
    //     ],
    //     fileIsRequired: false,
    //   }),
    // )
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
    const updateUserDto: UpdateUserDto = JSON.parse(payload.data);
    return this.usersService.update(
      currentCompanyId,
      currentUserId,
      +id,
      updateUserDto,
      imgFile,
    );
  }
  @Patch('toggleUserStatusById/:id')
  toggleUserStatusByI(
    @Param('id') id: string,
    @CurrentCompanyId() currentCompanyId: number,
    @Body() toggleIsActiveDto: ToggleIsActiveDto,
  ) {
    return this.usersService.toggleUserStatusByI(
      currentCompanyId,
      +id,
      toggleIsActiveDto,
    );
  }
  @Patch('changeMyPassword')
  changeMyPassword(@CurrentUserId() currentUserId: number, @Body() data: any) {
    return this.usersService.changeMyPassword(currentUserId, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id);
  }
  @Delete('removeUserRole/:id')
  removeUserRole(@Param('id') id: string): Promise<void> {
    return this.usersService.removeUserRole(id);
  }
}
