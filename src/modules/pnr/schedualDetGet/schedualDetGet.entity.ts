import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';

import { FlightDetails } from '../../pnr/flightDetails';

@Table
export class SchedualDetGet extends Model {
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
  @Column(DataType.BOOLEAN)
  eTicketable: boolean;
  @Column(DataType.INTEGER)
  elapsedTime: number;
  @Column
  frequency: string;
  @Column(DataType.INTEGER)
  stopCount: number;
  @Column(DataType.INTEGER)
  totalMilesFlown: number;
  // End
  @BelongsTo(() => FlightDetails)
  flightDetails: FlightDetails;
}

export default SchedualDetGet;
