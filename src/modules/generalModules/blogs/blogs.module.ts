import { Module } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';
import { blogsProviders } from './blogs.providers'; // Import the providers
import { FirebaseService } from '../../../database/firebase/firebase.service';

@Module({
  // imports: [FirebaseService], // Make sure UsersModule is imported here
  controllers: [BlogsController],
  providers: [BlogsService, FirebaseService, ...blogsProviders],
})
export class BlogsModule {}
