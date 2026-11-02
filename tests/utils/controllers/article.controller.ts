import type { Article } from '@/types/types';
import type { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseApiClient } from '../base-client';

export class ArticleController extends BaseApiClient {
  private readonly createdSlugs = new Set<string>();

  constructor(
    request: APIRequestContext,
    private readonly token: string
  ) {
    super(request);
  }

  async create(data: Partial<Article>) {
    const response = await this.authPost(
      'articles',
      { article: data },
      this.token
    );
    if (response.ok()) this.createdSlugs.add(await this.returnedSlug(response));
    return response;
  }

  getBySlug(slug: string) {
    return this.authGet(`articles/${encodeURIComponent(slug)}`, this.token);
  }

  async update(slug: string, data: Partial<Article>) {
    const response = await this.authPut(
      `articles/${encodeURIComponent(slug)}`,
      { article: data },
      this.token
    );
    if (response.ok() && this.createdSlugs.has(slug)) {
      const updatedSlug = await this.returnedSlug(response);
      this.createdSlugs.delete(slug);
      this.createdSlugs.add(updatedSlug);
    }
    return response;
  }

  async delete(slug: string) {
    const response = await this.authDelete(
      `articles/${encodeURIComponent(slug)}`,
      this.token
    );
    if (response.ok() || response.status() === 404)
      this.createdSlugs.delete(slug);
    return response;
  }

  getList(
    params: {
      offset?: number;
      limit?: number;
      author?: string;
      tag?: string;
      favorited?: string;
    } = {}
  ) {
    return this.request.get('articles', { params });
  }

  async cleanup() {
    for (const slug of this.createdSlugs) {
      const response = await this.delete(slug);
      if (!response.ok() && response.status() !== 404) {
        throw new Error(
          `Article cleanup returned HTTP ${response.status()} for ${slug}`
        );
      }
    }
  }

  private async returnedSlug(response: APIResponse): Promise<string> {
    const slug = (await response.json()).article?.slug;
    if (typeof slug !== 'string' || !slug) {
      throw new Error(
        'Cannot track article for cleanup: response is missing its slug'
      );
    }
    return slug;
  }
}
