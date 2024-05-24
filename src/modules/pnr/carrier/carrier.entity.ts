import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasOne,
} from 'sequelize-typescript';

import { InnerSchedualDetGet } from 'src/modules/pnr/innerSchedualDetGet';
import { Equipment } from 'src/modules/pnr/equipment';

@Table
export class Carrier extends Model {
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
  marketing: string;
  @Column
  marketingFlightNumber: string;
  @Column
  operating: string;
  @Column
  operatingFlightNumber: string;

  // End

  @BelongsTo(() => InnerSchedualDetGet)
  innerSchedualDetGet: InnerSchedualDetGet;
  @HasOne(() => Equipment)
  equipment: Equipment;
}

export default Carrier;
