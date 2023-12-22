// eslint-disable-next-line @typescript-eslint/no-var-requires
// const dotenv = require('dotenv');
// // eslint-disable-next-line @typescript-eslint/no-var-requires
// const databaseConfig = require('./default.ts');

// dotenv.config();

// module.exports = databaseConfig;
// ***************************************************
// eslint-disable-next-line @typescript-eslint/no-var-requires
const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  development: {
    dialect: 'mssql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    dialectOptions: {
      bigNumberStrings: true,
    },
    PASSWORD_SECRET: process.env.PASSWORD_SECRET_DEVELOPMENT,
    JWT_SECRET: process.env.JWT_SECRET_DEVELOPMENT,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET_DEVELOPMENT,
    ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS,
  },
  test: {
    dialect: 'mssql',
    host: process.env.DB_HOST_TEST,
    port: parseInt(process.env.DB_PORT_TEST, 10),
    username: process.env.DB_USERNAME_TEST,
    password: process.env.DB_PASSWORD_TEST,
    database: process.env.DB_NAME_TEST,
    dialectOptions: {
      bigNumberStrings: true,
    },
    PASSWORD_SECRET: process.env.PASSWORD_SECRET_TEST,
    JWT_SECRET: process.env.JWT_SECRET_TEST,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET_TEST,
  },
  production: {
    dialect: 'mssql',
    host: process.env.DB_HOST_PRODUCTION,
    port: parseInt(process.env.DB_PORT_PRODUCTION, 10),
    username: process.env.DB_USERNAME_PRODUCTION,
    password: process.env.DB_PASSWORD_PRODUCTION,
    database: process.env.DB_NAME_PRODUCTION,
    dialectOptions: {
      bigNumberStrings: true,
    },
    PASSWORD_SECRET: process.env.PASSWORD_SECRET_PRODUCTION,
    JWT_SECRET: process.env.JWT_SECRET_PRODUCTION,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET_PRODUCTION,
  },
};
