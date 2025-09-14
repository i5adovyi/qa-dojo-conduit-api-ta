import { APIRequestContext } from "@playwright/test";

export abstract class BaseApiClient {
    protected request: APIRequestContext;

    constructor(request: APIRequestContext) {
        this.request = request;
    }

    protected async authPost(endpoint: string, data: any, token: string) {
        return this.request.post(endpoint, {
            data,
            headers: { Authorization: `Token ${token}` }
        });
    }

    protected async authGet(endpoint: string, token: string) {
        return this.request.get(endpoint, {
            headers: { Authorization: `Token ${token}` }
        });
    }

    protected async authPut(endpoint: string, data: any, token: string) {
        return this.request.put(endpoint, {
            data,
            headers: { Authorization: `Token ${token}` }
        });
    }

    protected async authDelete(endpoint: string, token: string) {
        return this.request.delete(endpoint, {
            headers: { Authorization: `Token ${token}` }
        });
    }
} 