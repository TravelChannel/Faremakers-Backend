import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';

import { Fare } from '../../pnr/fare';

@Table
export class PassengerInfoList extends Model {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => Fare)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    onDelete: 'NO ACTION',
  })
  fareId: number;
  // Start

  // End
  @BelongsTo(() => Fare)
  fare: Fare;
}

export default PassengerInfoList;
