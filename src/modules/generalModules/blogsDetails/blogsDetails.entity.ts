// company-company-branch-department.entity.ts
import {
  Table,
  Model,
  DataType,
  Column,
  ForeignKey,
  BelongsTo,
  // HasMany,
  // Index,
} from 'sequelize-typescript';

import { Blog } from '../blogs/entities/blog.entity';

@Table
export class BlogsDetails extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;
  @ForeignKey(() => Blog)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    onDelete: 'NO ACTION',
  })
  blogId: number;

  @Column(DataType.STRING)
  heading: string;

  @Column(DataType.STRING)
  summary: string;
  @BelongsTo(() => Blog)
  blog: Blog;
}
