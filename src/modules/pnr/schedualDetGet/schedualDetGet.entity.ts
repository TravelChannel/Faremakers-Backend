import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';

import { FlightDetails } from '../../pnr/flightDetails';
import { InnerSchedualDetGet } from '../InnerSchedualDetGet';

@Table
export class SchedualDetGet extends Model {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;
  // @Column({
  //   type: DataType.BIGINT,
  // })
  // id: number;

  @ForeignKey(() => FlightDetails)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    onDelete: 'NO ACTION',
  })
  flightDetailsId: number;
  // Start

  // End
  @HasMany(() => InnerSchedualDetGet)
  innerSchedualDetGet: InnerSchedualDetGet[];
  @BelongsTo(() => FlightDetails)
  flightDetails: FlightDetails;
}

export default SchedualDetGet;
