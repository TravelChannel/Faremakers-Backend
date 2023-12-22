/* eslint-disable @typescript-eslint/no-unused-vars */
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { AuthModule } from './modules/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './modules/auth/jwt.strategy'; // Import your JwtStrategy
import { AuthService } from './modules/auth/auth.service';
import { AuthMiddleware } from './common/middleware/auth.middleware';

import { UsersModule } from './modules/generalModules/users/users.module';
// import { RolesGuard } from './common/guards/roles.guard';
import { AuthGuard } from './common/guards/auth.guard';

import { DatabaseModule } from './database/database.module';
import { RolesModule } from './modules/generalModules/roles/roles.module';
import { PnrBookingsModule } from './modules/pnr/pnrBooking/pnrBookings.module';
import { databaseConfig } from 'src/database/config/default';
import { APP_GUARD } from '@nestjs/core'; // Import APP_GUARD
import { ResponseModule } from './common/utility/response/response.module';
import { HttpModule } from '@nestjs/axios';
import { createFileStorage } from './common/utils/file-storage.util'; // Import the utility function

const dbConfig = databaseConfig[process.env.NODE_ENV || 'development']; // Load the appropriate config based on environment
const JWT_SECRET = dbConfig.JWT_SECRET;

@Module({
  imports: [
    MulterModule.register({ storage: createFileStorage('./uploads/') }),
    ResponseModule,
    DatabaseModule,
    UsersModule,
    RolesModule,
    AuthModule,
    PnrBookingsModule,
    HttpModule,
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 10000,
        limit: 10,
      },
      {
        name: 'medium',
        ttl: 10000,
        limit: 20,
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 100,
      },
    ]),
    PassportModule.register({ defaultStrategy: 'jwt', session: true }), // Configure passport module
    JwtModule.register({
      secret: JWT_SECRET, // Replace with your actual JWT secret
      // signOptions: { expiresIn: '6h' },
      signOptions: { expiresIn: process.env.TOKEN_COOKIE_MAX_AGE },
    }),
  ],
  providers: [
    JwtStrategy,
    AuthService,

    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard, // Use the RolesGuard as a global guard
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard, // Use the RolesGuard as a global guard
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      // .apply(AuthMiddleware, LoggerMiddleware)
      .apply(LoggerMiddleware)
      // .exclude('auth/login', 'users') // Exclude the 'auth' route
      .exclude('auth/login') // Exclude the 'auth' route
      // .exclude(
      //   { path: '/api/auth/login', method: RequestMethod.ALL }, // Exclude this specific route
      // )
      .forRoutes('*'); // Apply middlewares to all routes except 'auth'
  }
}
