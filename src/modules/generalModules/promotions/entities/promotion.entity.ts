import {
  Table,
  Column,
  Model,
  DataType,
  // HasMany
} from 'sequelize-typescript';
// import { User } from '../../users/entities/user.entity';

@Table
export class Promotion extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  title: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  description: string;
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
    allowNull: false,
  })
  isActive: boolean;
}

// You can define associations here if needed

export default Promotion;
