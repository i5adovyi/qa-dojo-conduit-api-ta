import { faker } from '@faker-js/faker';

export const userInfo = () => {
  return {
    email: faker.internet.email().toLowerCase(),
    password: 'qatest123!',
    username: `${faker.person.firstName().toLowerCase()}qadojo`,
  };
};
