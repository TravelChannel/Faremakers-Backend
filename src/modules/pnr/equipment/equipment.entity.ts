import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';

import { Carrier } from 'src/modules/pnr/carrier';

@Table
export class Equipment extends Model {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => Carrier)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    onDelete: 'NO ACTION',
  })
  carrierId: number;
  // Start
  @Column
  code: string;
  @Column
  typeForFirstLeg: string;
  @Column
  typeForLastLeg: string;

  // End

  @BelongsTo(() => Carrier)
  carrier: Carrier;
}

export default Equipment;
