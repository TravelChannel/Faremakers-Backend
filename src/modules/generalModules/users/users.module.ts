import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';

import { UsersService } from './users.service';
import { usersProviders } from './users.providers';
import { FirebaseModule } from '../../../database/firebase/firebase.module';

@Module({
  imports: [FirebaseModule], // Import FirebaseModule

  controllers: [UsersController],
  providers: [UsersService, ...usersProviders],
  exports: [UsersService],
})
export class UsersModule {}
