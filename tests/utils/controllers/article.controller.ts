import { Article } from '@/types/types';
import { APIRequestContext } from '@playwright/test';
import { BaseApiClient } from '../base-client';

export class ArticleController extends BaseApiClient {
  baseURL: string;
  constructor(request: APIRequestContext) {
    super(request);
    this.baseURL = 'articles';
  }

  async create(articleData: Article, token: string) {
    return this.authPost(this.baseURL, { article: articleData }, token);
  }

  async getBySlug(slug: string, token?: string) {
    if (token) {
      return this.authGet(`${this.baseURL}/${slug}`, token);
    }
    return this.request.get(`${this.baseURL}/${slug}`);
  }

  async update(slug: string, articleData: Partial<Article>, token: string) {
    return this.authPut(
      `${this.baseURL}/${slug}`,
      { article: articleData },
      token
    );
  }

  async delete(slug: string, token: string) {
    return this.authDelete(`${this.baseURL}/${slug}`, token);
  }

  async getAll(token?: string) {
    if (token) {
      return this.authGet(this.baseURL, token);
    }
    return this.request.get(this.baseURL);
  }
}
