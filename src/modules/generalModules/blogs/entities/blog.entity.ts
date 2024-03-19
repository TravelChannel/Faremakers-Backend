import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
// import { User } from '../../users/entities/user.entity';
import { Sequelize } from 'sequelize-typescript';

import { BlogsDetails } from '../../blogsDetails/index';

@Table
export class Blog extends Model {
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
  @HasMany(() => BlogsDetails)
  blogsDetails: BlogsDetails;
}

// You can define associations here if needed

export default Blog;
