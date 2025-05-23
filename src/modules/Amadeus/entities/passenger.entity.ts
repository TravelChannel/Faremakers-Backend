import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { AMD_Booking } from './booking.entity';
import { AMD_Baggage } from './baggage.entity';

@Table({ tableName: 'AMD_Passenger', timestamps: false })
export class AMD_Passenger extends Model<AMD_Passenger> {

  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  passengerId: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  firstName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  lastName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  gender: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  dateOfBirth: Date;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  passportNo: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  passportExpiryDate: Date;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  type: string;

  // Foreign Key Relationship with AMD_Booking
  @ForeignKey(() => AMD_Booking)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  orderId: string;

  @BelongsTo(() => AMD_Booking)
  booking: AMD_Booking;

  // Relationship with AMD_Baggage
  @HasMany(() => AMD_Baggage)
  baggage: AMD_Baggage[];
}
