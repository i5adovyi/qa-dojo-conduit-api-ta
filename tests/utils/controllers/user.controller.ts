import type { Registration } from '@/types/types';
import type { APIRequestContext } from '@playwright/test';
import { BaseApiClient } from '../base-client';

export class UserController extends BaseApiClient {
  constructor(
    request: APIRequestContext,
    private readonly token?: string
  ) {
    super(request);
  }

  create(user: Registration) {
    return this.request.post('users', { data: { user } });
  }

  login(user: Pick<Registration, 'email' | 'password'>) {
    return this.request.post('users/login', { data: { user } });
  }

  getUserInfo() {
    if (!this.token) throw new Error('Token required');
    return this.authGet('user/', this.token);
  }

  update(user: { bio?: string; image?: string }) {
    if (!this.token) throw new Error('Token required');
    return this.authPut('user/', { user }, this.token);
  }
}
