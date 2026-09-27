import { D365ApiClient } from './D365ApiClient';
import { expect } from '@playwright/test';

export class OpportunityApiService {
  readonly client: D365ApiClient;

  constructor(client: D365ApiClient) {
    this.client = client;
  }

  async getOpportunityById(opportunityId: string): Promise<any> {
    const response = await this.client.get(`opportunities(${opportunityId})?$select=opportunityid,name,statecode,statuscode,_originatingleadid_value,_customerid_value,_parentcontactid_value`);
    expect(response.status()).toBe(200);
    return await response.json();
  }

  async getOpportunityByLeadId(leadId: string): Promise<any> {
    const response = await this.client.get(`opportunities?$filter=_originatingleadid_value eq ${leadId}`);
    expect(response.status()).toBe(200);
    const result = await response.json();
    return result.value && result.value.length > 0 ? result.value[0] : null;
  }
}
