import { Comment, CommentResponse } from '@/types/types';
import { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseApiClient } from '../base-client';

export class CommentController extends BaseApiClient {
  baseURL: string;
  private token: string;

  constructor(request: APIRequestContext, token: string) {
    super(request);
    this.baseURL = 'articles';
    this.token = token;
  }

  async add(slug: string, commentData: Comment): Promise<APIResponse> {
    const authToken = this.token;
    if (!authToken) throw new Error('Token required');
    return this.authPost(
      `${this.baseURL}/${slug}/comments`,
      commentData,
      authToken
    );
  }

  async delete(slug: string, commentId: string): Promise<APIResponse> {
    const authToken = this.token;
    if (!authToken) throw new Error('Token required');
    return this.authDelete(`${this.baseURL}/${slug}/comments/${commentId}`, authToken);
  }
}
