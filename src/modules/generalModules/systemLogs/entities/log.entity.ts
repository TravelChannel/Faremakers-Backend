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
    allowNull: false,
  })
  level: string;
  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  message: string;
  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  meta: string;
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  timestamp: Date;
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
    allowNull: false,
  })
  isActive: boolean;
}

// You can define associations here if needed

export default Log;
