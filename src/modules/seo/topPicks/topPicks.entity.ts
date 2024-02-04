import {
  Table,
  Column,
  Model,
  DataType,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';

import { SEOAirlinesData } from '../seoAirlines/entities/seoAirlinesData.entity';

@Table
export class TopPicks extends Model {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;
  @ForeignKey(() => SEOAirlinesData)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    onDelete: 'NO ACTION',
  })
  seoAirlinesDataId: number;
  @Column
  destination: string;
  @BelongsTo(() => SEOAirlinesData)
  pnrBooking: SEOAirlinesData;
  // End
}

export default TopPicks;
