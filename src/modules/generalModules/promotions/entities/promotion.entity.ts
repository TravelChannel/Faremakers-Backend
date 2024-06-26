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
    type: DataType.DATE,
    allowNull: true,
  })
  startDate: Date;
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  endDate: Date;
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
    allowNull: false,
  })
  isActive: boolean;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  img: string;
}

// You can define associations here if needed

export default Promotion;
