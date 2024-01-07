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
export class TotalFare extends Model {
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
  @Column(DataType.INTEGER)
  baseFareAmount: number;
  @Column(DataType.INTEGER)
  baseFareCurrency: number;
  @Column(DataType.INTEGER)
  constructionAmount: number;
  @Column(DataType.INTEGER)
  constructionCurrency: number;
  @Column
  currency: string;
  @Column(DataType.INTEGER)
  equivalentAmount: number;
  @Column(DataType.INTEGER)
  totalPrice: number;
  @Column(DataType.INTEGER)
  totalTaxAmount: number;
  // End
  @BelongsTo(() => Fare)
  fare: Fare;
}

export default TotalFare;
