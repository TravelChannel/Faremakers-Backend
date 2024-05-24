import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';

import { FlightDetails } from 'modules/pnr/flightDetails';

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

  @ForeignKey(() => FlightDetails)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    onDelete: 'NO ACTION',
  })
  flightDetailsId: number;
  // Start
  @Column
  JOURNEY_CODE: string;
  @Column
  CLASS_CODE: string;
  @Column(DataType.INTEGER)
  FareType: number;
  // End
  @BelongsTo(() => FlightDetails)
  flightDetails: FlightDetails;
}

export default BookingFlight;
