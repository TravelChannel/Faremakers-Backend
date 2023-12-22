import * as dotenv from 'dotenv';
dotenv.config();

export const databaseConfig = {
  development: {
    dialect: 'mssql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    dialectOptions: {
      bigNumberStrings: true,
      options: {
        // Set the request timeout (in milliseconds) to a higher value
        requestTimeout: 60000000, // 30 seconds (adjust as needed)
      },
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
