import { Article } from '@/types/types';
import { APIRequestContext } from '@playwright/test';
import { BaseApiClient } from '../base-client';

export class ArticleController extends BaseApiClient {
  baseURL: string;
  private token: string;
  constructor(request: APIRequestContext, token: string) {
    super(request);
    this.baseURL = 'articles';
    this.token = token;
  }

  async create(articleData: Article) {
    const authToken = this.token;
    if (!authToken) throw new Error('Token required');
    return this.authPost(this.baseURL, { article: articleData }, authToken);
  }

  async getBySlug(slug: string) {
    const authToken = this.token;
    if (authToken) {
      return this.authGet(`${this.baseURL}/${slug}`, authToken);
    }
    return this.request.get(`${this.baseURL}/${slug}`);
  }

  async update(slug: string, articleData: Partial<Article>) {
    const authToken = this.token;
    if (!authToken) throw new Error('Token required');
    return this.authPut(
      `${this.baseURL}/${slug}`,
      { article: articleData },
      authToken
    );
  }

  async delete(slug: string) {
    const authToken = this.token;
    if (!authToken) throw new Error('Token required');
    return this.authDelete(`${this.baseURL}/${slug}`, authToken);
  }

  async getAll() {
    const authToken = this.token;
    if (authToken) {
      return this.authGet(this.baseURL, authToken);
    }
    return this.request.get(this.baseURL);
  }
}
