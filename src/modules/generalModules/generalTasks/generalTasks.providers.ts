import { GeneralTask } from './entities/generalTask.entity';
import { GENERAL_TASKS_REPOSITORY } from 'src/shared/constants';

export const generalTasksProviders = [
  {
    provide: GENERAL_TASKS_REPOSITORY,
    useValue: GeneralTask,
  },
];
