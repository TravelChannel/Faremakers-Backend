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
  BaggageAllowance,
  ExtraBaggage,
  BookingFlight,
  Fare,
  TotalFare,
  PassengerInfoList,
]);

// Sync the models with the database, dropping and recreating tables
sequelize
  .sync({
    force: true,
  })
  // .sync()
  .then(() => {
    console.log('Database synchronized...');
  })
  .catch((error) => {
    console.error('Error synchronizing the database:', error);
    console.error('------------------------------:', error.message);
  });

export { sequelize, Transaction, Op };
