import { Comment } from '@/types/types';
import { faker } from '@faker-js/faker';

export function commentData(): Comment {
  return {
    comment: {
      body: faker.lorem.words(10),
    },
  };
}
