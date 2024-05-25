import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasOne,
} from 'sequelize-typescript';

import { PassengerInfoList } from '../../pnr/passengerInfoList';
import { CurrencyConversion } from '../../pnr/currencyConversion';

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
  @HasOne(() => CurrencyConversion)
  currencyConversion: CurrencyConversion;
}

export default PassengerInfo;
