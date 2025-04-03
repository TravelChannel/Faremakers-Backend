import { Table, Column, Model, ForeignKey, BelongsTo, DataType, Sequelize } from 'sequelize-typescript';
import { AMD_Passenger } from './passenger.entity';
import PnrBooking from 'src/modules/pnr/pnrBooking/entities/pnrBooking.entity';

@Table({ tableName: 'AMD_FareDetails', timestamps: false })
export class AMD_FareDetails extends Model<AMD_FareDetails> {
  @Column({ primaryKey: true, autoIncrement: true })
  fareId: number;

  @ForeignKey(() => PnrBooking)
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

  @BelongsTo(() => PnrBooking)
  booking: PnrBooking;
}
