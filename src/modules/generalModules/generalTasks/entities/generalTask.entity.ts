import { Table, Column, Model, DataType } from 'sequelize-typescript';
// import { User } from '../../users/entities/user.entity';

@Table
export class GeneralTask extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  description: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  flag: boolean;
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isAdminControl: boolean;
}

// You can define associations here if needed

export default GeneralTask;
