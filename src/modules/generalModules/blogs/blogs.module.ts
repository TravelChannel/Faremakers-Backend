import { Module } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';
import { blogsProviders } from './blogs.providers'; // Import the providers
import { FirebaseModule } from '../../../database/firebase/firebase.module';

@Module({
  imports: [FirebaseModule], // Import FirebaseModule

  controllers: [BlogsController],
  providers: [BlogsService, ...blogsProviders],
})
export class BlogsModule {}
