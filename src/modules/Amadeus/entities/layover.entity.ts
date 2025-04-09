import { Table, Column, Model, ForeignKey, BelongsTo, DataType } from 'sequelize-typescript';
import { AMD_FlightDetails } from './flight-details.entity';

@Table({ tableName: 'AMD_Layover', timestamps: false })
export class AMD_Layover extends Model<AMD_Layover> {
  @Column({ type: DataType.BIGINT, primaryKey: true, autoIncrement: true })
  layoverId: number;


  @Column({ type: DataType.STRING })
  location: string;

  @Column({ type: DataType.STRING })
  duration: string;

  @ForeignKey(() => AMD_FlightDetails)
  @Column({ type: DataType.BIGINT, allowNull: false })
  flightId: number;

  @BelongsTo(() => AMD_FlightDetails)
  flight: AMD_FlightDetails;
}
