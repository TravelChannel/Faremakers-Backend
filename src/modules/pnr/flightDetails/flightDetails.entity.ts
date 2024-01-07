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
export class FlightDetails extends Model {
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
  @Column(DataType.INTEGER)
  adults: number;
  @Column(DataType.INTEGER)
  children: number;
  @Column(DataType.INTEGER)
  infants: number;
  @Column
  classtype: string;
  // End
  @BelongsTo(() => PnrBooking)
  pnrBooking: PnrBooking;
}

export default FlightDetails;
