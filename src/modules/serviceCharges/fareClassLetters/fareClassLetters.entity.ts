import {
  Table,
  Column,
  Model,
  DataType,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { FareClass } from '../fareClass/index';

@Table
export class FareClassLetters extends Model {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;
  @ForeignKey(() => FareClass)
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
    onDelete: 'NO ACTION',
  })
  fareClassId: number;
  @Column
  name: string;
  @Column
  description: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: {
      name: 'unique_fareClassLetters_code',
      msg: 'fareClassLetters must be unique.',
    },
  })
  code: string;

  // End
  @BelongsTo(() => FareClass)
  fareClass: FareClass;
}

export default FareClassLetters;
