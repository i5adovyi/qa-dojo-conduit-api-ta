import { articlePayload } from '@/data/article.data';
import { test } from '@/fixtures/fixtures';

let articleData = articlePayload();

test.describe('Create Article API', () => {
  test('Create Article with valid data', async ({ article }) => {
    const response = await article.create(articleData);
    console.log(await response.json())
  });
});
