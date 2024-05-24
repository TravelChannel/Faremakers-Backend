import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';

import { InnerSchedualDetGet } from 'modules/pnr/innerSchedualDetGet';

@Table
export class Departure extends Model {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => InnerSchedualDetGet)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    onDelete: 'NO ACTION',
  })
  innerSchedualDetGetId: number;
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

  @BelongsTo(() => InnerSchedualDetGet)
  innerSchedualDetGet: InnerSchedualDetGet;
}

export default Departure;
