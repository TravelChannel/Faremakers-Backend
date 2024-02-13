import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
  HasOne,
} from 'sequelize-typescript';

import { User } from '../../../generalModules/users/entities/user.entity';
import { PnrDetail } from '../../PnrDetails';
import { FlightDetails } from '../../flightDetails';
import { PnrServiceCharges } from '../../../serviceCharges/pnrServiceCharges';
import { PnrPayment } from '../../../paymentModules/paymob/entities/pnrPayment.entity';

@Table
export class PnrBooking extends Model {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    onDelete: 'NO ACTION',
  })
  userId: number;
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: 0,
    allowNull: false,
  })
  isPaid: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: 0,

    allowNull: false,
  })
  isReqForCancellation: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: 0,

    allowNull: false,
  })
  isReqForRefund: boolean;
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: 0,
    allowNull: false,
  })
  isReqForReIssue: boolean;
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: {
      name: 'unique_pnr',
      msg: 'pnr must be unique.',
    },
    validate: {
      notNull: {
        msg: 'pnr is required.',
      },
      notEmpty: {
        msg: 'pnr cannot be empty.',
      },
      len: {
        args: [3, 50],
        msg: 'pnr must be between 9 and 20 characters.',
      },
    },
  })
  pnr: string;
  @BelongsTo(() => User)
  user: User;
  @HasMany(() => PnrDetail)
  pnrDetail: PnrDetail[];
  @HasOne(() => FlightDetails)
  flightDetails: FlightDetails;
  @HasOne(() => PnrServiceCharges)
  pnrServiceCharges: PnrServiceCharges;
  @HasOne(() => PnrPayment)
  pnrPayment: PnrPayment;
}

export default PnrBooking;
