import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export class Sector extends Model {
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
    unique: {
      name: 'unique_Sector_code',
      msg: 'code must be unique.',
    },
  })
  code: string;

  // End
}

export default Sector;
