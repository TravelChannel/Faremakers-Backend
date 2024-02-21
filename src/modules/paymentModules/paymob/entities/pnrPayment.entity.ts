import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';

import { PnrBooking } from '../../../pnr/pnrBooking/entities/pnrBooking.entity';

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
    type: DataType.DOUBLE,
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

  // New
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  is_payment_locked: boolean;
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  is_return: boolean;
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  is_cancel: boolean;
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  is_returned: boolean;
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  is_canceled: boolean;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: true,
  })
  merchant_order_id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: true,
  })
  wallet_notification: string;

  @Column({
    type: DataType.DOUBLE,
    allowNull: false,
    defaultValue: true,
  })
  paid_amount_cents: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  notify_user_with_email: boolean;
  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: true,
  })
  order_url: string;

  @Column({
    type: DataType.DOUBLE,
    allowNull: false,
    defaultValue: true,
  })
  commission_fees: number;

  @Column({
    type: DataType.DOUBLE,
    allowNull: false,
    defaultValue: true,
  })
  delivery_fees_cents: number;

  @Column({
    type: DataType.DOUBLE,
    allowNull: false,
    defaultValue: true,
  })
  delivery_vat_cents: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  payment_method: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  merchant_staff_tag: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  api_source: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  created_at_original: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  updated_at_original: string;
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  terminal_id: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  is_hidden: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  error_occured: boolean;
  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  is_live: boolean;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: true,
  })
  source_id: number;
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  is_captured: boolean;
  // New End

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
