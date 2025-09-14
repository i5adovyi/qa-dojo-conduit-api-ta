import { APIRequestContext } from '@playwright/test';
import { BaseApiClient } from '../base-client';

export class ArticleController extends BaseApiClient {
  baseURL: string;
  constructor(request: APIRequestContext) {
    super(request);
    this.baseURL = 'articles';
  }
}
