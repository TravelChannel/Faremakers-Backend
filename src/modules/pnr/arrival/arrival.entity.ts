import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';

import { SchedualDetGet } from '../../pnr/schedualDetGet';

@Table
export class Arrival extends Model {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => SchedualDetGet)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    onDelete: 'NO ACTION',
  })
  schedualDetGetId: number;
  // Start
  @Column
  airport: string;
  @Column
  city: string;
  @Column
  country: string;
  @Column
  terminal: string;
  @Column
  time: string;

  // End

  @BelongsTo(() => SchedualDetGet)
  schedualDetGet: SchedualDetGet;
}

export default Arrival;
