import { Blog } from './entities/blog.entity';
import { BLOGS_REPOSITORY } from 'shared/constants';

export const blogsProviders = [
  {
    provide: BLOGS_REPOSITORY,
    useValue: Blog,
  },
];
