import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export class FareClass extends Model {
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
    type: DataType.STRING,
    allowNull: false,
  })
  description: code;

  // End
}

export default FareClass;
