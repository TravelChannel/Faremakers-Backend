import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';

import { PnrUser } from '../../pnrUsers';

@Table
export class PnrBooking extends Model {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => PnrUser)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    onDelete: 'NO ACTION',
  })
  pnrUserId: number;
  // Start
  @Column({
    type: DataType.STRING,
    allowNull: false,

    validate: {
      notNull: {
        msg: 'pnr is required.',
      },
      notEmpty: {
        msg: 'pnr cannot be empty.',
      },
      len: {
        args: [3, 50],
        msg: 'pnr must be between 5 and 20 characters.',
      },
    },
  })
  pnr: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,

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
  })
  cnic: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  passportNo: string;
  // End
  @BelongsTo(() => PnrUser)
  pnrUser: PnrUser;
}

export default PnrBooking;
