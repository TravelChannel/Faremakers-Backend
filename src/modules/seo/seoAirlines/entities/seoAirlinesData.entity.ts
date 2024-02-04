import {
  Table,
  Column,
  Model,
  DataType,
  // HasMany
} from 'sequelize-typescript';
// import { User } from '../../users/entities/user.entity';

@Table
export class SEOAirlinesData extends Model {
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
  flightname: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  flightCode: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  mainHeading: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  heading1: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  heading2: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  heading3: string;
  @Column({
    type: DataType.TINYINT,
    defaultValue: 1,
    allowNull: false,
  })
  isActive: number;
}

// You can define associations here if needed

export default SEOAirlinesData;
