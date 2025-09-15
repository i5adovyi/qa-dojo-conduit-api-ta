import { faker } from '@faker-js/faker';

export const articlePayload = () => {
  return {
    body: faker.lorem.words(20),
    description: faker.lorem.words(5),
    title: faker.lorem.words(3),
    tagList: Array.from({ length: 3 }, () => faker.lorem.word()),
  };
};
