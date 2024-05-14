import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
// import { User } from '../../users/entities/user.entity';
import { Sequelize } from 'sequelize';

import { FlightSearchesDetail } from '../flightSearchesDetail';

@Table
export class FlightSearches extends Model {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  })
  searchDate: Date;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  userIpAddress: string;
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  loggedInUserId: number;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  tripType: string;
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue: 0,
  })
  adults: number;
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue: 0,
  })
  children: number;
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    defaultValue: 0,
  })
  infants: number;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  cityName: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  countryName: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  classtype: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  countryCode: string;

  @HasMany(() => FlightSearchesDetail)
  flightSearchesDetail: FlightSearchesDetail[];
}

// You can define associations here if needed

export default FlightSearches;
