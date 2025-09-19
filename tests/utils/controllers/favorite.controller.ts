import { APIRequestContext } from '@playwright/test';
import { BaseApiClient } from '../base-client';

export class FavoriteController extends BaseApiClient {
  private baseURL = 'articles';
  private token: string;

  constructor(request: APIRequestContext, token: string) {
    super(request);
    this.token = token;
  }

  async favoriteArticle(slug: string) {
    return this.authPost(`${this.baseURL}/${slug}/favorite`, {}, this.token);
  }

  async unfavoriteArticle(slug: string) {
    return this.authDelete(`${this.baseURL}/${slug}/favorite`, this.token);
  }
}
