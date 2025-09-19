import { validArticle } from '@/data/article.data';
import { commentData } from '@/data/comment.data';
import { test } from '@/fixtures/fixtures';
import { APIResponse, expect } from '@playwright/test';

test.describe('Favourite articles -  Article API', () => {
  let slug: string;
  let resp: APIResponse;

  test.beforeAll(async ({ article, user }) => {
    const userResponse = await user.getUserInfo();
    resp = await article.create(validArticle());
    slug = (await resp.json()).article.slug as string;
  });

  test(
    'LWIO-037: Add comment to article',
    {
      tag: ['@smoke', '@regression', '@positive'],
    },
    async ({ comment }) => {
      let payload = commentData();
      const response = await comment.add(slug, payload);

      expect(response.status()).toBe(200);
      const responseBody = await response.json();

      expect(responseBody).toHaveProperty('comment');
      expect(responseBody.comment.body).toEqual(payload.comment.body);
    }
  );

  test(
    'LWIO-038: Delete own comment',
    {
      tag: ['@smoke', '@regression', '@positive'],
    },
    async ({ comment }) => {
      // Create comment for article
      let payload = commentData();
      const createResponse = await comment.add(slug, payload);

      expect(createResponse.status()).toBe(200);
      const createResponseBody = await createResponse.json();
      const commentId = createResponseBody.comment.id;

      expect(createResponseBody).toHaveProperty('comment');
      expect(createResponseBody.comment.body).toEqual(payload.comment.body);

      // Delete the comment
      const deleteResponse = await comment.delete(slug, commentId);
      expect(deleteResponse.status()).toBe(204);
    }
  );
});
