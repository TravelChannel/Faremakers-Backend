import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasOne,
} from 'sequelize-typescript';

import { Fare } from 'modules/pnr/fare';
import { PassengerInfo } from 'modules/pnr/passengerInfo';

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
  @HasOne(() => PassengerInfo)
  passengerInfo: PassengerInfo;
}

export default PassengerInfoList;
