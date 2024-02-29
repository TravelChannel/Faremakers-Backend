import {
  Table,
  Column,
  Model,
  DataType,
  // HasMany
} from 'sequelize-typescript';
// import { User } from '../../users/entities/user.entity';

@Table
export class Rating extends Model {
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
  review: string;
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  stars: number;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  })
  isActive: boolean;
}

// You can define associations here if needed

export default Rating;
