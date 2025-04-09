import { Table, Column, Model, ForeignKey, BelongsTo, HasMany, DataType } from 'sequelize-typescript';
import { AMD_Booking } from './booking.entity';
import { AMD_Layover } from './layover.entity';

@Table({ tableName: 'AMD_FlightDetails', timestamps: false })
export class AMD_FlightDetails extends Model<AMD_FlightDetails> {
  @Column({ primaryKey: true, autoIncrement: true })
  flightId: number;

  @ForeignKey(() => AMD_Booking)
  @Column
  orderId: string;

  @Column({ type: DataType.STRING })
  departure: string;

  @Column({ type: DataType.STRING })
  arrival: string;

  @Column({ type: DataType.STRING })
  departDate: string;

  @Column({ type: DataType.STRING })
  arrivalDate: string;

  @Column({ type: DataType.STRING })
  departTime: string;

  @Column({ type: DataType.STRING })
  arrivalTime: string;

  @Column({ type: DataType.STRING })
  marketingCarrier: string;

  @Column({ type: DataType.STRING })
  flightNumber: string;

  @Column({ type: DataType.STRING })
  bookingClass: string;

  @Column({ type: DataType.STRING })
  cabinClass: string;

  @Column({ type: DataType.STRING })
  baggageAllowance: string;

  @Column({ type: DataType.STRING })
  flightDuration: string;

  @BelongsTo(() => AMD_Booking)
  booking: AMD_Booking;

  @HasMany(() => AMD_Layover)
  layovers: AMD_Layover[];
}
