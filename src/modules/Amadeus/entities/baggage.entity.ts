import { Table, Column, Model, ForeignKey, BelongsTo, DataType } from 'sequelize-typescript';
import { AMD_Passenger } from './passenger.entity';

@Table({ tableName: 'AMD_Baggage', timestamps: false })
export class AMD_Baggage extends Model<AMD_Baggage> {
  @Column({ primaryKey: true, autoIncrement: true })
  baggageId: number;

  @Column({ type: DataType.STRING })
  baggageAllowance: string;

  @ForeignKey(() => AMD_Passenger)
  @Column
  passengerId: number;

  @BelongsTo(() => AMD_Passenger)
  passenger: AMD_Passenger;
}
