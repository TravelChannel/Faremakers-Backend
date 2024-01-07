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
export class ExtraBaggage extends Model {
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

  @Column
  unit: string;

  @Column
  weight: string;

  @Column
  ABBR: string;

  @Column
  NO_OF_BAGS: string;

  @Column
  ADV_TAX: string;

  @Column
  AMOUNT: string;

  @Column
  ACTUAL_AMOUNT: string;

  @Column
  WEIGHT: string;

  @Column
  PIECE: string;

  @Column
  DESCRIPTION: string;
  // End
  @BelongsTo(() => PnrBooking)
  pnrBooking: PnrBooking;
}

export default ExtraBaggage;
