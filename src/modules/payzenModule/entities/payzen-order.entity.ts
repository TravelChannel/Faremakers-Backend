import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
} from 'sequelize-typescript';

@Table({ tableName: 'PayZenOrder', timestamps: false })
export class PayZenOrder extends Model<PayZenOrder> {
  @PrimaryKey
  @Column({ type: DataType.BIGINT, allowNull: false })
  PayZenID: number;

  @Column({ type: DataType.STRING(20), allowNull: true })
  ConsumerNo: string;

  @Column({ type: DataType.STRING(10), allowNull: true })
  psidStatus: string;

  @Column({ type: DataType.STRING(20), allowNull: true })
  ChallanNo: string;

  @Column({ type: DataType.CHAR(10), allowNull: true })
  amountPaid: string;

  @Column({ type: DataType.CHAR(10), allowNull: true })
  paidDate: string;

  @Column({ type: DataType.CHAR(10), allowNull: true })
  paidTime: string;

  @Column({ type: DataType.CHAR(10), allowNull: true })
  bankCode: string;

  @Column({ type: DataType.BIGINT, allowNull: true })
  PnrBookingId: number;
}
