// company-company-branch-department.entity.ts
import {
  Table,
  Model,
  DataType,
  Column,

  // HasMany,
  // Index,
} from 'sequelize-typescript';

@Table
export class BlogTypes extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column(DataType.STRING)
  name: string;
  @Column(DataType.STRING)
  description: string;
}
