import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';

import { PnrBooking } from 'src/modules/pnr/pnrBooking/entities/pnrBooking.entity';
import { CommissionCategories } from '../CommissionCategories';

@Table
export class PnrServiceCharges extends Model {
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
  @ForeignKey(() => CommissionCategories)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    onDelete: 'NO ACTION',
  })
  commissionCategoryId: number;
  @Column({
    type: DataType.DOUBLE,
    allowNull: false,
  })
  percentage: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  code: string;

  // End
  @BelongsTo(() => PnrBooking)
  pnrBooking: PnrBooking;
  @BelongsTo(() => CommissionCategories)
  commissionCategory: CommissionCategories;
}

export default PnrServiceCharges;
