import { APIRequestContext, APIResponse, expect } from '@playwright/test';
import { config } from '../config/environment';

export class D365ApiClient {
  readonly requestContext: APIRequestContext;
  readonly baseUrl: string;

  constructor(requestContext: APIRequestContext) {
    this.requestContext = requestContext;
    this.baseUrl = config.apiBaseUrl;
  }

  private getDefaultHeaders(): Record<string, string> {
    return {
      'Accept': 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
      'OData-MaxVersion': '4.0',
      'OData-Version': '4.0',
      'Prefer': 'return=representation'
    };
  }

  async get(endpoint: string, headers?: Record<string, string>): Promise<APIResponse> {
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}/${endpoint}`;
    return await this.requestContext.get(url, {
      headers: { ...this.getDefaultHeaders(), ...headers }
    });
  }

  async post(endpoint: string, data: any, headers?: Record<string, string>): Promise<APIResponse> {
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}/${endpoint}`;
    return await this.requestContext.post(url, {
      headers: { ...this.getDefaultHeaders(), ...headers },
      data
    });
  }

  async patch(endpoint: string, data: any, headers?: Record<string, string>): Promise<APIResponse> {
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}/${endpoint}`;
    return await this.requestContext.patch(url, {
      headers: { ...this.getDefaultHeaders(), ...headers },
      data
    });
  }

  async delete(endpoint: string, headers?: Record<string, string>): Promise<APIResponse> {
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}/${endpoint}`;
    return await this.requestContext.delete(url, {
      headers: { ...this.getDefaultHeaders(), ...headers }
    });
  }
}
