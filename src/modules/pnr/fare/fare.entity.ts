import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasOne,
  HasMany,
} from 'sequelize-typescript';

import { FlightDetails } from 'modules/pnr/flightDetails';
import { TotalFare } from 'modules/pnr/totalFare';
import { PassengerInfoList } from 'modules/pnr/passengerInfoList';

@Table
export class Fare extends Model {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => FlightDetails)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
    onDelete: 'NO ACTION',
  })
  flightDetailsId: number;
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
  @BelongsTo(() => FlightDetails)
  flightDetails: FlightDetails;
  @HasOne(() => TotalFare)
  totalFare: TotalFare;
  @HasMany(() => PassengerInfoList)
  passengerInfoList: PassengerInfoList;
}

export default Fare;
