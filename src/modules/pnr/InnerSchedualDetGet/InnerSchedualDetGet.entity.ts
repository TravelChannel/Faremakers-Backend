import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasOne,
} from 'sequelize-typescript';

import { Arrival } from '../../pnr/arrival';
import { Departure } from '../../pnr/departure';
import { Carrier } from '../../pnr/carrier';
import { SchedualDetGet } from '../../pnr/schedualDetGet';

@Table
export class InnerSchedualDetGet extends Model {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  localId: number;
  @Column
  id: number;

  @ForeignKey(() => SchedualDetGet)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    onDelete: 'NO ACTION',
  })
  schedualDetGetId: number;
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
  @BelongsTo(() => SchedualDetGet)
  schedualDetGet: SchedualDetGet;
  @HasOne(() => Arrival)
  arrival: Arrival;
  @HasOne(() => Departure)
  departure: Departure;
  @HasOne(() => Carrier)
  carrier: Carrier;
}

export default InnerSchedualDetGet;
