import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
  HasOne,
} from 'sequelize-typescript';

import { PnrBooking } from '../../pnr/pnrBooking/entities/pnrBooking.entity';
import { ExtraBaggage } from '../../pnr/extraBaggage';
import { BaggageAllowance } from '../../pnr/baggageAllowance';
import { BookingFlight } from '../../pnr/bookingFlight';
import { Fare } from '../../pnr/fare';
import { GroupDescription } from '../../pnr/groupDescription';
import { SchedualDetGet } from '../../pnr/schedualDetGet';
import { FlightSegments } from '../../pnr/flightSegments';
import { SeatsAvailables } from '../../pnr/seatsAvailables';

@Table
export class FlightDetails extends Model {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => PnrBooking)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    onDelete: 'NO ACTION',
  })
  pnrBookingId: number;
  // Start
  @Column
  pricingSubsource: string;
  @Column(DataType.INTEGER)
  adults: number;
  @Column(DataType.INTEGER)
  children: number;
  @Column(DataType.INTEGER)
  infants: number;
  @Column
  classtype: string;
  // End
  @BelongsTo(() => PnrBooking)
  pnrBooking: PnrBooking;
  @HasMany(() => ExtraBaggage)
  extraBaggages: ExtraBaggage;
  @HasMany(() => BaggageAllowance)
  baggageAllowance: BaggageAllowance;
  @HasMany(() => BookingFlight)
  bookingFlight: BookingFlight;
  @HasOne(() => Fare)
  fare: Fare;
  @HasMany(() => GroupDescription)
  groupDescription: GroupDescription;
  @HasMany(() => SchedualDetGet)
  schedualDetGet: SchedualDetGet;
  @HasMany(() => SeatsAvailables)
  seatsAvailables: SeatsAvailables;
  @HasMany(() => FlightSegments)
  flightSegments: FlightSegments;
}

export default FlightDetails;
