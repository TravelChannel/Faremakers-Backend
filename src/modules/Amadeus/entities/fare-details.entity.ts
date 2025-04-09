import { Table, Column, Model, ForeignKey, BelongsTo, DataType, Sequelize } from 'sequelize-typescript';
import { AMD_Booking } from './booking.entity';
import { AMD_Passenger } from './passenger.entity';

@Table({ tableName: 'AMD_FareDetails', timestamps: false })
export class AMD_FareDetails extends Model<AMD_FareDetails> {
  @Column({ primaryKey: true, autoIncrement: true })
  fareId: number;

  @ForeignKey(() => AMD_Booking)
  @Column
  orderId: string;

  @Column({ type: DataType.STRING })
  rateClass: string;

  @Column({ type: DataType.DECIMAL(18, 2) })
  fareAmount: number;

  @Column({ type: DataType.STRING })
  currency: string;

  @Column({ type: DataType.STRING })
  refundPolicy: string;

  @Column({
    type: DataType.DATE, // Ensures both DATE and TIME are stored
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'), // Correctly sets current timestamp
  })
  createdAt: Date;

  @BelongsTo(() => AMD_Booking)
  booking: AMD_Booking;
}
