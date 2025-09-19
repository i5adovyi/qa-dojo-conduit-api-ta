import { User } from '@/types/types';
import { APIRequestContext } from '@playwright/test';
import { BaseApiClient } from '../base-client';

export class UserController extends BaseApiClient {
  baseURL: string;
  private token?: string;
  constructor(request: APIRequestContext, token?: string) {
    super(request);
    this.baseURL = 'users';
    this.token = token;
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

  async getUserInfo() {
    const authToken = this.token;
    if (!authToken) throw new Error('Token required');
    return this.authGet('user/', authToken);
  }

  async update(userInfo: Partial<User>) {
    const authToken = this.token;
    if (!authToken) throw new Error('Token required');
    return this.authPut('user/', { user: userInfo }, authToken);
  }
}
