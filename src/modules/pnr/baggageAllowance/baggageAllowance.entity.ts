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
export class BaggageAllowance extends Model {
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
  unit: string;

  @Column(DataType.DOUBLE)
  weight: number;

  // End
  @BelongsTo(() => FlightDetails)
  flightDetails: FlightDetails;
}

export default BaggageAllowance;
