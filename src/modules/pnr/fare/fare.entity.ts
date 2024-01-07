import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasOne,
} from 'sequelize-typescript';

import { PnrBooking } from '../../pnr/pnrBooking/entities/pnrBooking.entity';
import { TotalFare } from '../../pnr/totalFare';

@Table
export class Fare extends Model {
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
  @Column(DataType.BOOLEAN)
  eTicketable: boolean;
  @Column
  governingCarriers: string;
  @Column
  lastTicketDate: string;
  @Column
  lastTicketTime: string;
  @Column
  validatingCarrierCode: string;
  @Column(DataType.BOOLEAN)
  vita: boolean;
  // End
  @BelongsTo(() => PnrBooking)
  pnrBooking: PnrBooking;
  @HasOne(() => TotalFare)
  totalFare: TotalFare;
}

export default Fare;
