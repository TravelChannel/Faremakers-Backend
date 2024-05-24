import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';

import { FlightDetails } from 'src/modules/pnr/flightDetails';

@Table
export class FlightSegments extends Model {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
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
  departure: string;
  @Column
  arrival: string;
  @Column
  date: string;
  // End
  @BelongsTo(() => FlightDetails)
  flightDetails: FlightDetails;
}

export default FlightSegments;
