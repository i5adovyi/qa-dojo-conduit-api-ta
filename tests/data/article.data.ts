import { randomUUID } from 'node:crypto';
import type { Article } from '@/types/types';

export function validArticle(overrides: Partial<Article> = {}): Article {
  const id = randomUUID();
  return {
    title: `QA article ${id}`,
    description: `Description for ${id}`,
    body: `Body of the test article ${id}`,
    tagList: ['qa', 'api'],
    ...overrides,
  };
}

export function invalidArticle(
  overrides: Partial<Article> = {},
  removeProps: (keyof Article)[] = []
): Partial<Article> {
  const data: Partial<Article> = validArticle(overrides);
  for (const field of removeProps) delete data[field];
  return data;
}
