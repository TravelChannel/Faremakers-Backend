import { Table, Column, Model, DataType } from 'sequelize-typescript';
// import { User } from '../../users/entities/user.entity';
import { Sequelize } from 'sequelize-typescript';

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
    allowNull: true,
  })
  mainTitle: string;
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  shortDescription: string;
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  headerUrl: string;
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  author: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  img: string;
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  visits: number;
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
    allowNull: false,
  })
  isActive: boolean;
  @Column({
    type: DataType.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    allowNull: false,
  })
  publishDate: Date;
}

// You can define associations here if needed

export default GeneralTask;
