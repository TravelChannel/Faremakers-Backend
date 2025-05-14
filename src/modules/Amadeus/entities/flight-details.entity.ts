import { Table, Column, Model, ForeignKey, BelongsTo, HasMany, DataType } from 'sequelize-typescript';
import { AMD_Layover } from './layover.entity';
import PnrBooking from 'src/modules/pnr/pnrBooking/entities/pnrBooking.entity';

@Table({ tableName: 'AMD_FlightDetails', timestamps: false })
export class AMD_FlightDetails extends Model<AMD_FlightDetails> {
  @Column({ type: DataType.BIGINT, primaryKey: true, autoIncrement: true })
  flightId: number;

  @ForeignKey(() => PnrBooking)
  @Column({ type: DataType.BIGINT }) // ✅ Add explicit data type
  pnrBookingId: number;

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

  @BelongsTo(() => PnrBooking, { onDelete: 'CASCADE', onUpdate: 'CASCADE' }) // Define constraints here
  booking: PnrBooking;

  @HasMany(() => AMD_Layover)
  layovers: AMD_Layover[];
}
