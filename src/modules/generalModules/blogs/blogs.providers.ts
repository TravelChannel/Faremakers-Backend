import { Blog } from './entities/blog.entity';
import { BLOGS_REPOSITORY } from 'src/shared/constants';

export const blogsProviders = [
  {
    provide: BLOGS_REPOSITORY,
    useValue: Blog,
  },
];
