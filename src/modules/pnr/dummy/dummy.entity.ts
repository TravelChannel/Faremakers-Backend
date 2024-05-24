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
export class ExtraBaggage extends Model {
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

  // End
  @BelongsTo(() => FlightDetails)
  flightDetails: FlightDetails;
}

export default ExtraBaggage;
