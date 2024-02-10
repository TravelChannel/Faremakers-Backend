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
    type: DataType.STRING,
    allowNull: true,
  })
  id: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  pending: boolean;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  amount_cents: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  success: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  is_auth: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  is_capture: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  is_standalone_payment: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  is_voided: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  is_refunded: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  is_3d_secure: boolean;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  integration_id: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  profile_id: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  has_parent_transaction: boolean;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  order: number;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  created_at: Date;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  currency: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  merchant_commission: number;

  // @Column({
  //   type: DataType.ARRAY(DataType.JSONB),
  //   allowNull: true,
  // })
  // discount_details: any[];

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  is_void: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  is_refund: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  error_occurred: boolean;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  refunded_amount_cents: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  captured_amount: number;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  updated_at: Date;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  is_settled: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  bill_balanced: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  is_bill: boolean;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  owner: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  data_message: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  source_data_type: string;

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
    type: DataType.INTEGER,
    allowNull: true,
  })
  acq_response_code: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  txn_response_code: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  hmac: string;

  // End
  @BelongsTo(() => PnrBooking)
  pnrBooking: PnrBooking;
}

export default PnrPayment;
