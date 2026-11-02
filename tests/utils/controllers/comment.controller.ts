import type { Comment } from '@/types/types';
import type { APIRequestContext } from '@playwright/test';
import { BaseApiClient } from '../base-client';

export class CommentController extends BaseApiClient {
  constructor(
    request: APIRequestContext,
    private readonly token: string
  ) {
    super(request);
  }

  add(slug: string, data: Comment) {
    return this.authPost(
      `articles/${encodeURIComponent(slug)}/comments`,
      data,
      this.token
    );
  }

  list(slug: string) {
    return this.authGet(
      `articles/${encodeURIComponent(slug)}/comments`,
      this.token
    );
  }

  delete(slug: string, commentId: string | number) {
    return this.authDelete(
      `articles/${encodeURIComponent(slug)}/comments/${encodeURIComponent(commentId)}`,
      this.token
    );
  }
}
