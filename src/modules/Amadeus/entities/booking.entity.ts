import { Table, Column, Model, DataType, HasMany, Sequelize } from 'sequelize-typescript';
import { AMD_FlightDetails } from './flight-details.entity';
import { AMD_Passenger } from './passenger.entity';
import { AMD_FareDetails } from './fare-details.entity';

@Table({ tableName: 'AMD_Booking', timestamps: false })
export class AMD_Booking extends Model<AMD_Booking> {
  
  @Column({
    type: DataType.STRING,
    primaryKey: true,
    allowNull: false,
  })
  orderId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  pnr: string;
 
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  phoneNumber: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  userEmail: string;

  @Column({
    type: DataType.DECIMAL(18, 2),
    allowNull: false,
  })
  totalFare: number;

  @Column({
    type: DataType.DECIMAL(18, 2),
    allowNull: false,
  })
  baseFare: number;

  @Column({
    type: DataType.DECIMAL(18, 2),
    allowNull: false,
  })
  taxAmount: number;

  @Column({
    type: DataType.DECIMAL(18, 2),
    allowNull: false,
    defaultValue: 0,
  })
  serviceCharges: number;

  @Column({
    type: DataType.DATE, // Ensures both DATE and TIME are stored
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'), // Correctly sets current timestamp
  })
  createdAt: Date;
  
  

  // Relationships
  @HasMany(() => AMD_Passenger)
  passengers: AMD_Passenger[];

  @HasMany(() => AMD_FlightDetails)
  flights: AMD_FlightDetails[];

  @HasMany(() => AMD_FareDetails)
  fareDetails: AMD_FareDetails[];
}
