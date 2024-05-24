import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';

import { PassengerInfo } from 'src/modules/pnr/passengerInfo';

@Table
export class CurrencyConversion extends Model {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => PassengerInfo)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    onDelete: 'NO ACTION',
  })
  passengerInfoId: number;
  // Start

  @Column
  from: string;
  @Column
  to: string;

  @Column(DataType.DOUBLE)
  exchangeRateUsed: number;
  // End
  @BelongsTo(() => PassengerInfo)
  passengerInfo: PassengerInfo;
}

export default CurrencyConversion;
