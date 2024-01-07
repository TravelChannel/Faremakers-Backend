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
export class BookingFlight extends Model {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  localId: number;
  @Column({
    type: DataType.BIGINT,
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
  JOURNEY_CODE: string;
  @Column
  CLASS_CODE: string;
  @Column(DataType.INTEGER)
  FareType: number;
  // End
  @BelongsTo(() => PnrBooking)
  pnrBooking: PnrBooking;
}

export default BookingFlight;
