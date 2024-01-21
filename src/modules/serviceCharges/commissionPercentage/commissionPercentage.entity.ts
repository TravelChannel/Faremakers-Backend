import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export class CommissionPercentage extends Model {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.DOUBLE,
    allowNull: false,
  })
  percentage: number;

  // End
}

export default CommissionPercentage;
