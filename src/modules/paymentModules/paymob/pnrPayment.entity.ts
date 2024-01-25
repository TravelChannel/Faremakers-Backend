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
export class PnrPayment extends Model {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  localId: number;

  @ForeignKey(() => PnrBooking)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    onDelete: 'NO ACTION',
  })
  pnrBookingId: number;

  @Column({
    type: DataType.DOUBLE,
    allowNull: false,
  })
  amount_cents: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  created_at: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  currency: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  error_occured: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  has_parent_transaction: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  id: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  integration_id: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  is_3d_secure: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  is_auth: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  is_capture: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  is_refunded: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  is_standalone_payment: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  is_voided: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  order: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  owner: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  pending: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  source_data_pan: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  source_data_sub_type: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  source_data_type: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  success: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  payment_method: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  order_status: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  payment_status: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  transaction_ref: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  order_group_id: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  cart_group_id: string;

  // End
  @BelongsTo(() => PnrBooking)
  pnrBooking: PnrBooking;
}

export default PnrPayment;
