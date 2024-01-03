// branch-department.entity.ts
import { Table, DataType, Model, Column, HasMany } from 'sequelize-typescript';
import { PnrBooking } from '../pnrBooking/entities/pnrBooking.entity';

@Table
export class PnrUser extends Model {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

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
        args: [3, 50],
        msg: 'phoneNumber must be between 9 and 20 characters.',
      },
    },
  })
  phoneNumber: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  userEmail: string;
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
    unique: {
      name: 'unique_user_cnic',
      msg: 'cnic must be unique.',
    },
  })
  cnic: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  passportNo: string;
  @HasMany(() => PnrBooking)
  pnrBooking: PnrBooking[];
}
