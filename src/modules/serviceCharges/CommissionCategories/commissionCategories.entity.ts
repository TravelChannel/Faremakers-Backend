import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export class CommissionCategories extends Model {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column
  name: string;
  @Column
  description: string;
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  precedence: number;
  @Column({
    type: DataType.DOUBLE,
    allowNull: false,
  })
  percentage: number;

  // End
}

export default CommissionCategories;
