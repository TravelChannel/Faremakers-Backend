import { Sequelize } from 'sequelize-typescript';
import { Transaction, Op } from 'sequelize';
import { databaseConfig } from 'src/database/config/default';

import { User } from '../modules/generalModules/users/entities/user.entity';
import { Role } from '../modules/generalModules/roles/entities/role.entity';
import { City } from '../modules/generalModules/cities';
// import { PnrUser } from '../modules/pnr/pnrUsers/entities/pnrUsers.entity';
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
import { FlightSegments } from '../modules/pnr/flightSegments';
import { Arrival } from '../modules/pnr/arrival';
import { Departure } from '../modules/pnr/departure';
import { Carrier } from '../modules/pnr/carrier';
import { Equipment } from '../modules/pnr/equipment';
import { CurrencyConversion } from '../modules/pnr/currencyConversion';
import { InnerSchedualDetGet } from '../modules/pnr/innerSchedualDetGet';
import { Promotion } from '../modules/generalModules/promotions/entities/promotion.entity';
import { CommissionCategories } from '../modules/serviceCharges/commissionCategories';
import { PnrPayment } from '../modules//paymentModules/paymob/entities/pnrPayment.entity';
import { PnrServiceCharges } from '../modules/serviceCharges/pnrServiceCharges';
import { CommissionPercentage } from '../modules/serviceCharges/commissionPercentage/entities/commissionPercentage.entity';
import { Airline } from '../modules/serviceCharges/airline';
import { Sector } from '../modules/serviceCharges/sector';
// import { Destination } from '../modules/serviceCharges/destination';
import { FareClass } from '../modules/serviceCharges/fareClass';
import { SEOAirlinesData } from '../modules/seo/seoAirlines/entities/seoAirlinesData.entity';
import { TopCities } from '../modules/seo/topCities/index';
import { TopPicks } from '../modules/seo/topPicks/index';
import { TopCountries } from '../modules/seo/topCountries/index';
import { FareClassLetters } from '../modules/serviceCharges/fareClassLetters';
import { Blog } from '../modules/generalModules/blogs/entities/blog.entity';
import { BlogTypes } from '../modules/generalModules/blogTypes/index';
import { Rating } from '../modules/generalModules/ratings/entities/rating.entity';

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
  // PnrUser,
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
  FlightSegments,
  Arrival,
  Departure,
  Carrier,
  Equipment,
  CurrencyConversion,
  InnerSchedualDetGet,
  PnrServiceCharges,
  Promotion,
  CommissionCategories,
  PnrPayment,
  CommissionPercentage,
  Airline,
  FareClass,
  // Destination,
  Sector,
  SEOAirlinesData,
  TopCities,
  TopPicks,
  TopCountries,
  FareClassLetters,
  Blog,
  BlogTypes,
  Rating,
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
    console.error('-----------------------------:', error.message);
  });

export { sequelize, Transaction, Op };
