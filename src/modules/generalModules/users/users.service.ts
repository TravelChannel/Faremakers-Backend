import {
  Injectable,
  Inject,
  HttpStatus,
  //  Session
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { FirebaseService } from '../../../database/firebase/firebase.service';

import { ToggleIsActiveDto } from 'src/shared/dtos/toggleIsActive.dto';

import { User } from './entities/user.entity';
import { USERS_REPOSITORY } from '../../../shared/constants';
import * as bcrypt from 'bcrypt';
import { databaseConfig } from 'src/database/config/default';

// import { SessionData } from 'express-session';

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
const OTP_SECRET = dbConfig.OTP_SECRET;

@Injectable()
export class UsersService {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly userRepository: typeof User,
    private readonly responseService: ResponseService,
    private readonly firebaseService: FirebaseService,
  ) {}

  async create(
    isCurrentUserAdmin: number,
    createUserDto: CreateUserDto,
  ): Promise<User> {
    const t: Transaction = await sequelize.transaction();
    try {
      const { password, ...rest } = createUserDto;

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
      const user = await this.userRepository.findOne({
        where: { email, isActive: true },
      });
      if (user) {
        return user;
      } else {
        return null;
      }
    } catch (error) {
      return null;
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
      where: { email, isActive: true },
    });
    return user;
  }
  // Login Function

  async findAll(req): Promise<User[]> {
    try {
      const whereOptionsMain: any = {};
      const whereOptionsCompanyId: any = {};
      const whereOptionsBranchId: any = {};
      const whereOptionsDepartmentId: any = {};

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
    currentUserId: number,
    isCurrentUserAdmin: number,
    // id: number,

    updateUserDto: UpdateUserDto,
    imgFile: Express.Multer.File,
  ): Promise<any> {
    try {
      const whereOptions: any = {};
      let myImg = updateUserDto.imgSrc;
      whereOptions.id = currentUserId;
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
      if (imgFile) {
        if (user.imgSrc) {
          // await this.firebaseService.deleteFile(promotion.img);
        }
        myImg = await this.firebaseService.uploadFile(imgFile, 'userProfiles');
      }
      user.username = updateUserDto.username || user.username;
      user.email = updateUserDto.email || user.email;
      user.dateOfBirth = updateUserDto.dateOfBirth || user.dateOfBirth;
      user.passportExpiryDate =
        updateUserDto.passportExpiryDate || user.passportExpiryDate;
      user.firstName = updateUserDto.firstName || user.firstName;
      user.lastName = updateUserDto.lastName || user.lastName;
      user.gender = updateUserDto.gender || user.gender;
      user.cnic = updateUserDto.cnic || user.cnic;
      user.passportNo = updateUserDto.passportNo || user.passportNo;
      user.imgSrc = myImg;

      // if (imgFile) {
      //   const imagePath =
      //     process.env.BASE_URL +
      //     ':' +
      //     process.env.PORT +
      //     '/uploads/users/profiles/' +
      //     imgFile.filename;
      //   user.imgSrc = imagePath; // Store the file path in the user table
      // }
      await user.save(); // Save the changes

      return this.responseService.createResponse(
        HttpStatus.OK,
        user,
        'Updated',
      );
    } catch (error) {
      console.log('error', error);
      return this.responseService.createResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        null,
        error.message,
      );
    }
  }
  async toggleUserStatusByI(
    isCurrentUserAdmin: number,
    id: number,
    toggleIsActiveDto: ToggleIsActiveDto,
  ): Promise<any> {
    const t: Transaction = await sequelize.transaction();

    try {
      const whereOptions: any = {};
      whereOptions.id = id;

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

      user.isActive = toggleIsActiveDto.isActive || false;

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
    console.log(id);
    return this.responseService.createResponse(
      HttpStatus.OK,
      null,
      'Role Removed!',
    );
  }
  async verifyOtp(
    countryCode: string,
    phoneNumber: string,
    otp: string,
  ): Promise<User | null> {
    try {
      const user = await this.userRepository.findOne({
        where: { phoneNumber, countryCode },
      });
      if (user) {
        const isOtpValid = await bcrypt.compare(otp + OTP_SECRET, user.otp);
        if (!isOtpValid) {
          return null;
        }
        return user;
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }
  async findByPhoneNumber(
    countryCode: string,
    phoneNumber: string,
  ): Promise<User | null> {
    try {
      let user = await this.userRepository.findOne({
        where: { phoneNumber, countryCode },
      });
      if (user) {
        return user;
      } else {
        user = await this.userRepository.create({
          roleId: 2, // Assign default role to user
          isSuperAdmin: false, // By default user is not super admin
          phoneNumber,
          countryCode,
        });
      }
      return user;
    } catch (error) {
      console.log('Error-', error.message);
      return null;
    }
  }
  // Temporary Api
}
