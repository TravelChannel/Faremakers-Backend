// company-company-branch-department.entity.ts
import {
  Table,
  Model,
  DataType,
  Column,
  // HasMany,
  // Index,
} from 'sequelize-typescript';

@Table
export class City extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;
  @Column({
    type: DataType.STRING,

    allowNull: false,
    unique: {
      name: 'unique_city_name',
      msg: 'City name must be unique.',
    },
  })
  city: string;
  @Column({
    type: DataType.STRING,

    unique: {
      name: 'unique_city_code',
      msg: 'City code must be unique.',
    },
  })
  cityCode: string;

  @Column(DataType.STRING)
  cityAscii: string;

  @Column(DataType.FLOAT)
  lat: number;

  @Column(DataType.FLOAT)
  lng: number;

  @Column(DataType.STRING)
  country: string;

  @Column(DataType.STRING)
  iso2: string;

  @Column(DataType.STRING)
  iso3: string;

  @Column(DataType.STRING)
  adminName: string;

  @Column(DataType.STRING)
  capital: string;

  @Column(DataType.INTEGER)
  population: number;

  @Column(DataType.INTEGER)
  originalId: number;
}
