import type { APIRequestContext } from '@playwright/test';

export abstract class BaseApiClient {
  constructor(protected readonly request: APIRequestContext) {}

  protected authPost(endpoint: string, data: object, token: string) {
    return this.request.post(endpoint, {
      data,
      headers: { Authorization: `Token ${token}` },
    });
  }

  protected authGet(endpoint: string, token: string) {
    return this.request.get(endpoint, {
      headers: { Authorization: `Token ${token}` },
    });
  }

  protected authPut(endpoint: string, data: object, token: string) {
    return this.request.put(endpoint, {
      data,
      headers: { Authorization: `Token ${token}` },
    });
  }

  protected authDelete(endpoint: string, token: string) {
    return this.request.delete(endpoint, {
      headers: { Authorization: `Token ${token}` },
    });
  }
}
