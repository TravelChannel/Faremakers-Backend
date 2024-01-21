import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';

import { Airline } from '../airline/index';
import { FareClass } from '../fareClass/index';
import { Destination } from '../destination/index';
import { Sector } from '../sector/index';

@Table
export class CommissionPercentage extends Model {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.DOUBLE,
    allowNull: false,
  })
  percentage: number;

  @ForeignKey(() => Airline)
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
    onDelete: 'NO ACTION',
  })
  airlineId: number;
  @ForeignKey(() => FareClass)
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
    onDelete: 'NO ACTION',
  })
  fareClassId: number;
  @ForeignKey(() => Destination)
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
    onDelete: 'NO ACTION',
  })
  destinationId: number;
  @ForeignKey(() => Sector)
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
    onDelete: 'NO ACTION',
  })
  sectorId: number;

  // End
}

export default CommissionPercentage;
