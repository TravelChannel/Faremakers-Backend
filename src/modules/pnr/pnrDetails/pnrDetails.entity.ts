import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';

import { PnrBooking } from '../../pnr/pnrBooking/entities/pnrBooking.entity';

@Table
export class PnrDetail extends Model {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => PnrBooking)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    onDelete: 'NO ACTION',
  })
  pnrBookingId: number;
  // Start

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
  email: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  ticketNo: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  ticketLocalIssueDateTime: string;
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
  @BelongsTo(() => PnrBooking)
  pnrBooking: PnrBooking;
}

export default PnrDetail;
