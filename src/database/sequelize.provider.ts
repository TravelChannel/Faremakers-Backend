import { Sequelize } from 'sequelize-typescript';
import { Transaction, Op } from 'sequelize';
import { databaseConfig } from 'src/database/config/default';

import { User } from 'src/modules/generalModules/users/entities/user.entity';
import { Role } from 'src/modules/generalModules/roles/entities/role.entity';
import { City } from 'src/modules/generalModules/cities';
// import { PnrUser } from 'src/modules/pnr/pnrUsers/entities/pnrUsers.entity';
import { PnrBooking } from 'src/modules/pnr/pnrBooking/entities/pnrBooking.entity';
import { PnrDetail } from 'src/modules/pnr/pnrDetails';
import { BaggageAllowance } from 'src/modules/pnr/baggageAllowance';
import { ExtraBaggage } from 'src/modules/pnr/extraBaggage';
import { BookingFlight } from 'src/modules/pnr/bookingFlight';
import { Fare } from 'src/modules/pnr/fare';
import { TotalFare } from 'src/modules/pnr/totalFare';
import { PassengerInfoList } from 'src/modules/pnr/passengerInfoList';
import { PassengerInfo } from 'src/modules/pnr/passengerInfo';
import { FlightDetails } from 'src/modules/pnr/flightDetails';
import { GroupDescription } from 'src/modules/pnr/groupDescription';
import { SchedualDetGet } from 'src/modules/pnr/schedualDetGet';
import { FlightSegments } from 'src/modules/pnr/flightSegments';
import { Arrival } from 'src/modules/pnr/arrival';
import { Departure } from 'src/modules/pnr/departure';
import { Carrier } from 'src/modules/pnr/carrier';
import { Equipment } from 'src/modules/pnr/equipment';
import { CurrencyConversion } from 'src/modules/pnr/currencyConversion';
import { InnerSchedualDetGet } from 'src/modules/pnr/innerSchedualDetGet';
import { Promotion } from 'src/modules/generalModules/promotions/entities/promotion.entity';
import { CommissionCategories } from 'src/modules/serviceCharges/commissionCategories';
import { PnrPayment } from 'src/modules//paymentModules/paymob/entities/pnrPayment.entity';
import { PnrServiceCharges } from 'src/modules/serviceCharges/pnrServiceCharges';
import { CommissionPercentage } from 'src/modules/serviceCharges/commissionPercentage/entities/commissionPercentage.entity';
import { Airline } from 'src/modules/serviceCharges/airline';
import { Sector } from 'src/modules/serviceCharges/sector';
// import { Destination } from 'src/modules/serviceCharges/destination';
import { FareClass } from 'src/modules/serviceCharges/fareClass';
import { SEOAirlinesData } from 'src/modules/seo/seoAirlines/entities/seoAirlinesData.entity';
import { TopCities } from 'src/modules/seo/topCities/index';
import { TopPicks } from 'src/modules/seo/topPicks/index';
import { TopCountries } from 'src/modules/seo/topCountries/index';
import { FareClassLetters } from 'src/modules/serviceCharges/fareClassLetters';
import { Blog } from 'src/modules/generalModules/blogs/entities/blog.entity';
import { BlogTypes } from 'src/modules/generalModules/blogTypes/index';
import { Rating } from 'src/modules/generalModules/ratings/entities/rating.entity';
import { GeneralTask } from 'src/modules/generalModules/generalTasks/entities/generalTask.entity';
import { Log } from 'src/modules/generalModules/systemLogs/entities/Log.entity';
import { FlightSearches } from 'src/modules/generalModules/flightSearches';
import { FlightSearchesDetail } from 'src/modules/generalModules/flightSearchesDetail';

const dbConfig = databaseConfig[process.env.NODE_ENV || 'development']; // Load the appropriate config based on environment
const sequelize = new Sequelize({
  dialect: dbConfig.dialect,
  host: dbConfig.host,
  port: dbConfig.port,
  username: dbConfig.username,
  password: dbConfig.password,
  database: dbConfig.database,
  // dialectOptions: dbConfig.dialectOptions,
  logging: false,
  dialectOptions: { useUTC: false },
  timezone: '+05:00',
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
  GeneralTask,
  Log,
  FlightSearches,
  FlightSearchesDetail,
]);
// Test
// Sync the models with the database, dropping and recreating tables
sequelize
  // .sync({
  //   force: true,
  // })
  .sync()
  .then(() => {
    console.log('----dbConfig', dbConfig);

    console.log('Database synchronized...');
  })
  .catch((error) => {
    console.error('Error synchronizing the database:', error);
    console.error('------------------------------:', error.message);
  });

export { sequelize, Transaction, Op };
