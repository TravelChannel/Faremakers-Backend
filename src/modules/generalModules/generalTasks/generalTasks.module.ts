import { Module } from '@nestjs/common';
import { GeneralTasksService } from './generalTasks.service';
import { GeneralTasksController } from './generalTasks.controller';
import { generalTasksProviders } from './generalTasks.providers'; // Import the providers

@Module({
  controllers: [GeneralTasksController],
  providers: [GeneralTasksService, ...generalTasksProviders],
})
export class GeneralTasksModule {}
