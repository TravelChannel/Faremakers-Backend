import {
  Injectable,
  Inject,
  HttpStatus,
  //  Session
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { ToggleIsActiveDto } from 'src/shared/dtos/toggleIsActive.dto';

import { User } from './entities/user.entity';
import { USERS_REPOSITORY } from '../../../shared/constants';
import * as bcrypt from 'bcrypt';
import { databaseConfig } from 'src/database/config/default';

// import { SessionData } from 'express-session';

import { Role } from '../roles/entities/role.entity';
import {
  sequelize,
  Transaction,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Op,
} from '../../../database/sequelize.provider';

import { ResponseService } from '../../../common/utility/response/response.service';
import {
  EXCEPTION,
  GET_SUCCESS,
  SAVED_SUCCESS,
} from '../../../shared/messages.constants';
import { UpdateUserDto } from './dto/UpdateUser.dto';
import { UserProfile } from './entities/userProfile.entity';

// eslint-disable-next-line @typescript-eslint/no-unused-vars

const dbConfig = databaseConfig[process.env.NODE_ENV || 'development']; // Load the appropriate config based on environment
const PASSWORD_SECRET = dbConfig.PASSWORD_SECRET;

@Injectable()
export class UsersService {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly userRepository: typeof User,
    private readonly responseService: ResponseService,
  ) {}

  async create(
    currentCompanyId: number,
    createUserDto: CreateUserDto,
  ): Promise<User> {
    const t: Transaction = await sequelize.transaction();
    try {
      const { password, branch, department, roles, ...rest } = createUserDto;
      let company;
      if (currentCompanyId) {
        company = currentCompanyId;
      } else {
        company = createUserDto.company;
      }
      const hashedPassword = await bcrypt.hash(password + PASSWORD_SECRET, 10); // Hash the password with a salt of 10 rounds
      const newUser = await this.userRepository.create(
        {
          ...rest,
          password: hashedPassword,
        },
        { transaction: t },
      );

      await t.commit();
      return this.responseService.createResponse(
        HttpStatus.OK,
        newUser,
        SAVED_SUCCESS,
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

  async findByEmail(email: string): Promise<User | null> {
    try {
      const users = await this.userRepository.findOne({
        where: { email },
      });
      return this.responseService.createResponse(
        HttpStatus.OK,
        users,
        GET_SUCCESS,
      );
    } catch (error) {
      return this.responseService.createResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        null,
        error.message,
      );
    }
  }
  async findByEmailAndCompany(
    email: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    companyId: number,
  ): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
    });
  }
  // Login Function
  async findUserWithCompanyByEmail(
    email: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { email, isActive: 1 },
    });
    return user;
  }
  // Login Function

  async findAll(currentCompanyId: number, req): Promise<User[]> {
    try {
      console.log('params ', req.query);
      const whereOptions: any = {};
      const whereOptionsMain: any = {};
      const whereOptionsCompanyId: any = {};
      const whereOptionsBranchId: any = {};
      const whereOptionsDepartmentId: any = {};
      if (currentCompanyId) {
        whereOptions.companyId = currentCompanyId;
      }
      if (req.query.companyId > 0) {
        whereOptionsCompanyId.companyId = req.query.companyId;
      }
      if (req.query.branchId > 0) {
        whereOptionsBranchId.id = req.query.branchId;
      }
      if (req.query.departmentId > 0) {
        whereOptionsDepartmentId.id = req.query.departmentId;
      }
      if (req.query.q) {
        whereOptionsMain.username = {
          [Op.like]: `%${req.query.q}%`,
        };
      }
      const users = await this.userRepository.findAll({
        where: whereOptionsMain,
      });
      return this.responseService.createResponse(
        HttpStatus.OK,
        users,
        // { userFromSession, users },
        GET_SUCCESS,
      );
    } catch (error) {
      console.log(error);
      return this.responseService.createResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        null,
        error.message,
      );
    }
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
    });
  }

  async findMe(id: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: {
          id,
        },
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars

      return this.responseService.createResponse(
        HttpStatus.OK,
        {
          userData: user,
        },
        GET_SUCCESS,
      );
    } catch (error) {
      return this.responseService.createResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        null,
        EXCEPTION,
      );
    }
  }
  async findOne(id: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: {
          id,
        },
        include: [
          {
            model: UserProfile,
          },
        ],
      });
      return this.responseService.createResponse(
        HttpStatus.OK,
        user,
        GET_SUCCESS,
      );
    } catch (error) {
      return this.responseService.createResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        null,
        EXCEPTION,
      );
    }
  }

  async update(
    currentCompanyId: number,
    currentUserId: number,
    id: number,

    updateUserDto: UpdateUserDto,
    imgFile: Express.Multer.File,
  ): Promise<any> {
    try {
      const whereOptions: any = {};

      // if (currentCompanyId) {
      //   whereOptions.id = currentUserId;
      // }else{

      // }
      whereOptions.id = id;

      if (currentCompanyId) {
        // whereOptions.companyId = currentCompanyId;
      }
      const user = await this.userRepository.findOne({
        where: whereOptions,
      });
      if (!user) {
        return this.responseService.createResponse(
          HttpStatus.NOT_FOUND,
          null,
          'User not found',
        );
      }

      user.email = updateUserDto.email || user.email;
      user.lastName = updateUserDto.lastName || user.lastName;
      user.firstName = updateUserDto.firstName || user.firstName;
      user.contact = updateUserDto.contact || user.contact;
      user.username = updateUserDto.username || user.username;
      if (imgFile) {
        const imagePath =
          process.env.BASE_URL +
          ':' +
          process.env.PORT +
          '/uploads/users/profiles/' +
          imgFile.filename;
        user.imgSrc = imagePath; // Store the file path in the user table
      }
      await user.save(); // Save the changes

      return this.responseService.createResponse(
        HttpStatus.OK,
        { updateUserDto: updateUserDto },
        'Updated',
      );
    } catch (error) {
      return this.responseService.createResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        null,
        error.message,
      );
    }
  }
  async toggleUserStatusByI(
    currentCompanyId: number,
    id: number,
    toggleIsActiveDto: ToggleIsActiveDto,
  ): Promise<any> {
    const t: Transaction = await sequelize.transaction();

    try {
      const whereOptions: any = {};
      whereOptions.id = id;

      if (currentCompanyId) {
        whereOptions.companyId = currentCompanyId;
      }
      const user = await this.userRepository.findOne({
        where: whereOptions,
      });
      if (!user) {
        return this.responseService.createResponse(
          HttpStatus.NOT_FOUND,
          null,
          'User not found',
        );
      }

      user.isActive = toggleIsActiveDto.isActive || 0;

      await user.save({ transaction: t }); // Save the changes
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
  async changeMyPassword(id: number, data: any): Promise<any> {
    const t: Transaction = await sequelize.transaction();

    try {
      const user = await this.userRepository.findByPk(id);
      if (!user) {
        return this.responseService.createResponse(
          HttpStatus.NOT_FOUND,
          null,
          'User not found',
        );
      }
      // const isPasswordValid = true;

      const isPasswordValid = await bcrypt.compare(
        data.currentPassword + PASSWORD_SECRET,
        user.password,
      );
      // const isPasswordValid = await bcrypt.compare(
      //   user.password,
      //   data.currentPassword + PASSWORD_SECRET,
      // );
      if (!isPasswordValid) {
        return this.responseService.createResponse(
          HttpStatus.INTERNAL_SERVER_ERROR,
          null,
          'Incorrect Old Password',
        );
      }
      const isMatched = await (data.confirmNewPassword === data.newPassword);
      if (isMatched && isPasswordValid) {
        const hashedPassword = await bcrypt.hash(
          data.confirmNewPassword + PASSWORD_SECRET,
          10,
        );
        user.password = hashedPassword || 0;
      } else {
        return this.responseService.createResponse(
          HttpStatus.INTERNAL_SERVER_ERROR,
          null,
          'Passwords do not match',
        );
      }
      await user.save({ transaction: t }); // Save the changes
      await t.commit();

      return this.responseService.createResponse(
        HttpStatus.OK,
        null,
        'Passsword Changed Successfully',
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

  async remove(id: string): Promise<void> {
    const t: Transaction = await sequelize.transaction();

    try {
      if (Number(id) === 1) {
        return this.responseService.createResponse(
          HttpStatus.NOT_FOUND,
          null,
          'Super Admin Cannot be Deleted',
        );
      }
      const user = await this.userRepository.findByPk(id);
      if (!user) {
        return this.responseService.createResponse(
          HttpStatus.NOT_FOUND,
          null,
          'User not found',
        );
      }

      await user.destroy({ transaction: t });
      await t.commit();

      return this.responseService.createResponse(
        HttpStatus.OK,
        null,
        'Deleted!',
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
  async removeUserRole(id: string): Promise<void> {
    return this.responseService.createResponse(
      HttpStatus.OK,
      null,
      'Role Removed!',
    );
  }

  // Temporary Api
}
