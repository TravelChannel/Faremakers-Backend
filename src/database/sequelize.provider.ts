import { Sequelize } from 'sequelize-typescript';
import { Transaction, Op } from 'sequelize';
import { databaseConfig } from 'src/database/config/default';

import { User } from '../modules/generalModules/users/entities/user.entity';
import { Role } from '../modules/generalModules/roles/entities/role.entity';
import { City } from '../modules/generalModules/cities';
import { PnrUser } from '../modules/pnr/pnrUsers';
import { PnrBooking } from '../modules/pnr/pnrBooking/entities/pnrBooking.entity';
import { PnrDetail } from '../modules/pnr/pnrDetails';
import { BaggageAllowance } from '../modules/pnr/baggageAllowance';
import { ExtraBaggage } from '../modules/pnr/extraBaggage';
import { BookingFlight } from '../modules/pnr/bookingFlight';
import { Fare } from '../modules/pnr/fare';
import { TotalFare } from '../modules/pnr/totalFare';
import { PassengerInfoList } from '../modules/pnr/passengerInfoList';
import { PassengerInfo } from '../modules/pnr/passengerInfo';
import { FlightDetails } from '../modules/pnr/flightDetails';
import { GroupDescription } from '../modules/pnr/groupDescription';
import { SchedualDetGet } from '../modules/pnr/schedualDetGet';
import { SeatsAvailables } from '../modules/pnr/seatsAvailables';
import { FlightSegments } from '../modules/pnr/flightSegments';
import { Arrival } from '../modules/pnr/arrival';
import { Departure } from '../modules/pnr/departure';
import { Carrier } from '../modules/pnr/carrier';
import { Equipment } from '../modules/pnr/equipment';
import { CurrencyConversion } from '../modules/pnr/currencyConversion';
import { InnerSchedualDetGet } from '../modules/pnr/innerSchedualDetGet';

const dbConfig = databaseConfig[process.env.NODE_ENV || 'development']; // Load the appropriate config based on environment
const sequelize = new Sequelize({
  dialect: dbConfig.dialect,
  host: dbConfig.host,
  port: dbConfig.port,
  username: dbConfig.username,
  password: dbConfig.password,
  database: dbConfig.database,
  dialectOptions: dbConfig.dialectOptions,
});

sequelize.addModels([
  User,
  Role,
  City,
  PnrUser,
  PnrBooking,
  PnrDetail,
  FlightDetails,
  BaggageAllowance,
  ExtraBaggage,
  BookingFlight,
  Fare,
  TotalFare,
  PassengerInfoList,
  PassengerInfo,
  GroupDescription,
  SchedualDetGet,
  SeatsAvailables,
  FlightSegments,
  Arrival,
  Departure,
  Carrier,
  Equipment,
  CurrencyConversion,
  InnerSchedualDetGet,
]);

// Sync the models with the database, dropping and recreating tables
sequelize
  // .sync({
  //   force: true,
  // })
  .sync()
  .then(() => {
    console.log('Database synchronized...');
  })
  .catch((error) => {
    console.error('Error synchronizing the database:', error);
    console.error('--------------------------------:', error.message);
  });

export { sequelize, Transaction, Op };
