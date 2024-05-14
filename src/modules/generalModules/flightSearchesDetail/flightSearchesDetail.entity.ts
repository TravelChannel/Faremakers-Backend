// company-company-branch-department.entity.ts
import {
  Table,
  Model,
  DataType,
  Column,
  // Index,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';

import { FlightSearches } from '../flightSearches';

@Table
export class FlightSearchesDetail extends Model {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => FlightSearches)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    onDelete: 'NO ACTION',
  })
  flightSearchesId: number;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  cityFrom: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  cityTo: string;
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  departureDate: Date;
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  returnDate: Date;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  lattitude: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  longitude: string;
  @BelongsTo(() => FlightSearches)
  flightSearches: FlightSearches;
}
