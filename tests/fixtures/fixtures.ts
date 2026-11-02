import { randomUUID } from 'node:crypto';
import { validArticle } from '@/data/article.data';
import { userInfo } from '@/data/user.data';
import type { PublishedArticle, Registration } from '@/types/types';
import { ArticleController } from '@/utils/controllers/article.controller';
import { CommentController } from '@/utils/controllers/comment.controller';
import { FavoriteController } from '@/utils/controllers/favorite.controller';
import { UserController } from '@/utils/controllers/user.controller';
import { test as base, type APIRequestContext } from '@playwright/test';

type Account = { credentials: Registration; token: string };

type Fixtures = {
  registeredUser: Account;
  article: ArticleController;
  seededArticle: PublishedArticle;
  favourite: FavoriteController;
  comment: CommentController;
};

async function register(request: APIRequestContext): Promise<Account> {
  const credentials = userInfo();
  const response = await new UserController(request).create(credentials);
  if (response.status() !== 200) {
    throw new Error(
      `Test user registration returned HTTP ${response.status()}`
    );
  }
  const token = (await response.json()).user?.token;
  if (typeof token !== 'string' || !token) {
    throw new Error('Test user registration did not return a token');
  }
  return { credentials, token };
}

export const test = base.extend<Fixtures, { owner: Account }>({
  owner: [
    async ({ playwright }, use, workerInfo) => {
      const request = await playwright.request.newContext({
        baseURL: workerInfo.project.use.baseURL,
      });
      try {
        const account = await register(request);
        await use(account);
      } finally {
        await request.dispose();
      }
    },
    { scope: 'worker' },
  ],

  registeredUser: async ({ request }, use) => {
    await use(await register(request));
  },

  article: async ({ request, owner }, use) => {
    const article = new ArticleController(request, owner.token);
    try {
      await use(article);
    } finally {
      await article.cleanup();
    }
  },

  seededArticle: async ({ article }, use) => {
    const response = await article.create(
      validArticle({ tagList: [`qa-${randomUUID()}`] })
    );
    if (response.status() !== 200) {
      throw new Error(`Article setup returned HTTP ${response.status()}`);
    }
    await use((await response.json()).article);
  },

  favourite: async ({ request, owner }, use) => {
    await use(new FavoriteController(request, owner.token));
  },

  comment: async ({ request, owner }, use) => {
    await use(new CommentController(request, owner.token));
  },
});
