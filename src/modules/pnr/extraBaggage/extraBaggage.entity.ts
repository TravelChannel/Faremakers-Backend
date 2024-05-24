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

  @Column(DataType.INTEGER)
  SUB_CLASS_ID: number;

  @Column
  SUB_CLASS_DESC: string;

  @Column
  ABBR: string;

  @Column(DataType.INTEGER)
  NO_OF_BAGS: number;

  @Column(DataType.DOUBLE)
  ADV_TAX: number;

  @Column(DataType.DOUBLE)
  AMOUNT: number;

  @Column(DataType.DOUBLE)
  ACTUAL_AMOUNT: number;

  @Column(DataType.DOUBLE)
  WEIGHT: number;

  @Column(DataType.INTEGER)
  PIECE: number;

  @Column
  DESCRIPTION: string;
  // End
  @BelongsTo(() => FlightDetails)
  flightDetails: FlightDetails;
}

export default ExtraBaggage;
