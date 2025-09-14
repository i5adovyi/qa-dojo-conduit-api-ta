import { User } from '@/types/types';
import { APIRequestContext } from '@playwright/test';
import { BaseApiClient } from '../base-client';

export class UserController extends BaseApiClient {
  baseURL: string;
  constructor(request: APIRequestContext) {
    (super(request), (this.baseURL = 'users'));
  }

  async create(userInfo: User) {
    return await this.request.post(this.baseURL, {
      data: { user: userInfo },
    });
  }

  async login(userInfo: User) {
    return this.request.post(`${this.baseURL}/login`, {
      data: {
        user: userInfo,
      },
    });
  }
}
