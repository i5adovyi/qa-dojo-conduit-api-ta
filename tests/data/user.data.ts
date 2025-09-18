import { faker } from '@faker-js/faker';

export const userInfo = () => {
  return {
    email: faker.internet.email().toLowerCase(),
    password: process.env.USER_PASSWORD,
    username: `${faker.person.firstName().toLowerCase()}qadojo`,
  };
};
