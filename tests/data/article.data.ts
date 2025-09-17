import { Article } from '@/types/types';
import { faker } from '@faker-js/faker';

// For valid articles - returns complete Article type
export function validArticle(overrides: Partial<Article> = {}): Article {
  return {
    title: faker.lorem.words(3),
    description: faker.lorem.words(5),
    body: faker.lorem.words(20),
    tagList: Array.from({ length: 3 }, () => faker.lorem.word()),
    ...overrides
  };
}

// For negative testing - returns partial with missing properties
export function invalidArticle(
  overrides: Partial<Article> = {},
  removeProps: (keyof Article)[] = []
): Partial<Article> {
  const completeArticle = validArticle(overrides);

  // Remove specified properties for negative testing
  removeProps.forEach(prop => {
    delete completeArticle[prop];
  });

  return completeArticle;
}
