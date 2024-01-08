import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasOne,
} from 'sequelize-typescript';

import { SchedualDetGet } from '../../pnr/schedualDetGet';
import { Equipment } from '../../pnr/equipment';

@Table
export class Carrier extends Model {
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
  marketing: string;
  @Column
  marketingFlightNumber: string;
  @Column
  operating: string;
  @Column
  operatingFlightNumber: string;

  // End

  @BelongsTo(() => SchedualDetGet)
  schedualDetGet: SchedualDetGet;
  @HasOne(() => Equipment)
  equipment: Equipment;
}

export default Carrier;
