import { userInfo } from '@/data/user.data';
import { ArticleController } from '@/utils/controllers/article.controller';
import { FavoriteController } from '@/utils/controllers/favorite.controller';
import {
  getToken,
  isTokenValid,
  saveToken,
} from '@/utils/helpers/token-manager';
import { test as base } from '@playwright/test';
import { UserController } from '../utils/controllers/user.controller';

export type UserFixture = {
  token: string;
  article: ArticleController;
  user: UserController;
  favourite: FavoriteController;
};

export const test = base.extend<UserFixture>({
  token: async ({ request }, use) => {
    let token = getToken();

    if (!token || !(await isTokenValid(request, token))) {
      const data = userInfo();
      const user = new UserController(request);
      const response = await user.create(data);
      const responseBody = await response.json();

      token = responseBody.user.token;
      if (token) saveToken(token!);
    }

    if (!token) {
      throw new Error('Failed to get token');
    }

    await use(token);
  },

  article: async ({ request, token }, use) => {
    await use(new ArticleController(request, token));
  },

  user: async ({ request, token }, use) => {
    await use(new UserController(request, token));
  },

  favourite: async ({ request, token }, use) => {
    await use(new FavoriteController(request, token));
  },
});
