import {
  Table,
  Column,
  Model,
  DataType,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
// import { User } from '../../users/entities/user.entity';
import { Sequelize } from 'sequelize-typescript';

import { BlogTypes } from '../../blogTypes';

@Table
export class Blog extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;
  @ForeignKey(() => BlogTypes)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    onDelete: 'NO ACTION',
  })
  blogTypeId: number;
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
    type: DataType.STRING,
    allowNull: true,
  })
  headerUrl: string;
  @Column({
    type: DataType.STRING,
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

  @BelongsTo(() => BlogTypes)
  blogType: BlogTypes;
}

// You can define associations here if needed

export default Blog;
