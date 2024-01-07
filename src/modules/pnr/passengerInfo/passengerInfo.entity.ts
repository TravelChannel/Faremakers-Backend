import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';

import { PassengerInfoList } from '../../pnr/passengerInfoList';

@Table
export class PassengerInfo extends Model {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => PassengerInfoList)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    onDelete: 'NO ACTION',
  })
  passengerInfoListId: number;
  // Start
  @Column(DataType.BOOLEAN)
  nonRefundable: boolean;
  @Column(DataType.INTEGER)
  passengerNumber: number;
  @Column
  passengerType: string;
  // End
  @BelongsTo(() => PassengerInfoList)
  passengerInfoList: PassengerInfoList;
}

export default PassengerInfo;
