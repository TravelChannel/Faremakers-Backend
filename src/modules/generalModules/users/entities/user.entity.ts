import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { PnrBooking } from 'modules/pnr/pnrBooking/entities/pnrBooking.entity';
import { Role } from '../../roles/entities/role.entity';

@Table
export class User extends Model {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;
  @ForeignKey(() => Role)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    onDelete: 'NO ACTION',
  })
  roleId: number;
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  })
  isSuperAdmin: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    // unique: {
    //   name: 'unique_user_username',
    //   msg: 'Username must be unique.',
    // },
    // validate: {
    //   notNull: {
    //     msg: 'Username is required.',
    //   },
    //   notEmpty: {
    //     msg: 'Username cannot be empty.',
    //   },
    //   len: {
    //     args: [3, 50],
    //     msg: 'Username must be between 3 and 50 characters.',
    //   },
    // },
  })
  username: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: {
      name: 'unique_user_phoneNumber',
      msg: 'phoneNumber must be unique.',
    },
    validate: {
      notNull: {
        msg: 'phoneNumber is required.',
      },
      notEmpty: {
        msg: 'phoneNumber cannot be empty.',
      },
      len: {
        args: [6, 20],
        msg: 'phoneNumber must be between 6 and 20 characters.',
      },
    },
  })
  phoneNumber: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,

    validate: {
      notNull: {
        msg: 'countryCode is required.',
      },
      notEmpty: {
        msg: 'countryCode cannot be empty.',
      },
      len: {
        args: [1, 4],
        msg: 'countryCode must be between 1 and 4 characters.',
      },
    },
  })
  countryCode: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  otp: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  email: string;
  @Column({
    type: DataType.DATE,
  })
  dateOfBirth: Date;
  @Column({
    type: DataType.DATE,
  })
  passportExpiryDate: Date;
  @Column({
    type: DataType.STRING,
  })
  firstName: string;
  @Column({
    type: DataType.STRING,
  })
  lastName: string;
  @Column({
    type: DataType.STRING,
  })
  gender: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
    // unique: {
    //   name: 'unique_user_cnic',
    //   msg: 'cnic must be unique.',
    // },
  })
  cnic: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  passportNo: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  refreshToken: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  imgSrc: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    // validate: {
    //   notNull: {
    //     msg: 'Password is required.',
    //   },
    //   notEmpty: {
    //     msg: 'Password cannot be empty.',
    //   },
    //   len: {
    //     args: [3, 200],
    //     msg: 'Password must be between 3 and 200 characters.',
    //   },
    // },
  })
  password: string;
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
    allowNull: false,
  })
  isActive: boolean;

  // Define the hasMany association
  @HasMany(() => PnrBooking)
  pnrBooking: PnrBooking[];
  @BelongsTo(() => Role)
  role: Role;
}

export default User;
