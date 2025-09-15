import { userInfo } from '@/data/user.data';
import { User } from '@/types/types';
import { ArticleController } from '@/utils/controllers/article.controller';
import { test as base } from '@playwright/test';
import { UserController } from '../utils/controllers/user.controller';

export type UserFixture = {
  token: string;
  article: ArticleController;
};

export const test = base.extend<UserFixture>({
  token: async ({ request }, use) => {
    const data: User = userInfo();
    let user = new UserController(request);
    const response = await user.create(data);
    const token = (await response.json()).user.token;
    await use(token);
  },
  article: async ({ request, token }, use) => {
    await use(new ArticleController(request, token));
  },
});
