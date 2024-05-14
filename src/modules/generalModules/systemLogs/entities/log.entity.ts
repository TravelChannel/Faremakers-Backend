import {
  Table,
  Column,
  Model,
  DataType,
  // HasMany
} from 'sequelize-typescript';
// import { User } from '../../users/entities/user.entity';

@Table
export class Log extends Model {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  level: string;
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  message: string;
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  meta: string;
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  timestamp: Date;
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
    allowNull: true,
  })
  isActive: boolean;
}

// You can define associations here if needed

export default Log;
