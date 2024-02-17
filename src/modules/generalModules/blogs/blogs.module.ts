import { Module } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';
import { blogsProviders } from './blogs.providers'; // Import the providers

@Module({
  controllers: [BlogsController],
  providers: [BlogsService, ...blogsProviders],
})
export class BlogsModule {}
