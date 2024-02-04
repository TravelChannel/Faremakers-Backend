import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
// import { User } from '../../users/entities/user.entity';
import { TopCities } from '../../topCities/index';
import { TopPicks } from '../../topPicks/index';
import { TopCountries } from '../../topCountries/index';

@Table
export class SEOAirlinesData extends Model {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: {
      name: 'unique_flightname',
      msg: 'flightname name must be unique.',
    },
    validate: {
      notNull: {
        msg: 'flightname is required.',
      },
      notEmpty: {
        msg: 'flightname cannot be empty.',
      },
      len: {
        args: [3, 50],
        msg: 'flightname must be between 3 and 50 characters.',
      },
    },
  })
  flightname: string;
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: {
      name: 'unique_flightCode',
      msg: 'flightCode name must be unique.',
    },
    validate: {
      notNull: {
        msg: 'flightCode is required.',
      },
      notEmpty: {
        msg: 'flightCode cannot be empty.',
      },
      len: {
        args: [3, 50],
        msg: 'flightCode must be between 3 and 50 characters.',
      },
    },
  })
  flightCode: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  mainHeading: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  heading1: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  heading2: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  heading3: string;
  @Column({
    type: DataType.TINYINT,
    defaultValue: 1,
    allowNull: false,
  })
  isActive: number;

  @HasMany(() => TopPicks)
  topPicks: TopPicks;
  @HasMany(() => TopCities)
  topCities: TopCities;
  @HasMany(() => TopCountries)
  topCountries: TopCountries;
}

// You can define associations here if needed

export default SEOAirlinesData;
