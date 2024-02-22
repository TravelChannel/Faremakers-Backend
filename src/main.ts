import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as session from 'express-session';
import { ValidationPipe } from '@nestjs/common';
import { databaseConfig } from 'src/database/config/default';

import * as cookieParser from 'cookie-parser';
import * as passport from 'passport';
import * as bodyParser from 'body-parser';
import * as express from 'express';
import { join } from 'path';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Get the allowed origins from the environment
  const dbConfig = databaseConfig[process.env.NODE_ENV || 'development']; // Load the appropriate config based on environment

  const allowedOrigins = dbConfig.ALLOWED_ORIGINS
    ? dbConfig.ALLOWED_ORIGINS.split(',')
    : [];

  app.use(bodyParser.json({ limit: '1mb' }));
  app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }));
  app.use(cookieParser());

  // Enable CORS here
  app.enableCors({
    origin: allowedOrigins, // Replace with your frontend URL
    // origin: 'http://www.localhost:3000/', // Replace with your frontend URL
    // origin: '*',
    credentials: true,
  });

  app.setGlobalPrefix('api');
  // Apply ValidationPipe globally
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  // Configure sesssion middleware
  app.use(
    session({
      name: 'NestJs_SESSION',
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        // maxAge: 6 * 60 * 60 * 1000,
        maxAge: 21600000,
        // maxAge: 10000,
        // maxAge: process.env.TOKEN_COOKIE_MAX_AGE,

        secure: false,
      },
    }),
  );
  // Serve static files from the specified directory
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  // app.use('/uploads', express.static('uploads'));
  app.use(passport.initialize());
  app.use(passport.session());
  await app.listen(process.env.PORT || 5000);
}
bootstrap();
