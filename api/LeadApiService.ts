import { D365ApiClient } from './D365ApiClient';
import { LeadTestData } from '../utils/testDataGenerator';
import { expect } from '@playwright/test';

export interface QualifyResultEntity {
  '@odata.type': string;
  accountid?: string;
  contactid?: string;
  opportunityid?: string;
  name?: string;
  fullname?: string;
  subject?: string;
}

export interface QualifyResponse {
  '@odata.context'?: string;
  value: QualifyResultEntity[];
}

export class LeadApiService {
  readonly client: D365ApiClient;

  constructor(client: D365ApiClient) {
    this.client = client;
  }

  async createLead(data: LeadTestData): Promise<any> {
    const payload = {
      subject: data.subject,
      firstname: data.firstName,
      lastname: data.lastName,
      companyname: data.companyName,
      jobtitle: data.jobTitle,
      emailaddress1: data.email,
      telephone1: data.phone,
      mobilephone: data.mobilePhone
    };

    const response = await this.client.post('leads', payload, {
      'MSCRM.SuppressDuplicateDetection': 'true'
    });
    expect(response.status()).toBe(201);
    return await response.json();
  }

  async getLeadById(leadId: string): Promise<any> {
    const response = await this.client.get(`leads(${leadId})?$select=leadid,subject,firstname,lastname,companyname,emailaddress1,telephone1,statecode,statuscode`);
    expect(response.status()).toBe(200);
    return await response.json();
  }

  async qualifyLead(leadId: string): Promise<QualifyResponse> {
    const payload = {
      CreateAccount: true,
      CreateContact: true,
      CreateOpportunity: true,
      Status: 3 // Qualified status code
    };

    // Pause briefly to allow D365 background plugins to settle after lead creation
    await new Promise(resolve => setTimeout(resolve, 2000));

    const response = await this.client.post(`leads(${leadId})/Microsoft.Dynamics.CRM.QualifyLead`, payload, {
      'MSCRM.SuppressDuplicateDetection': 'true'
    });

    if (response.status() !== 200 && response.status() !== 204) {
      const errText = await response.text();
      console.log(`QualifyLead Response Status: ${response.status()}, Body: ${errText}`);
    }

    expect([200, 204]).toContain(response.status());
    if (response.status() === 200) {
      return await response.json();
    }

    // Query resulting opportunity if 204 returned
    const oppRes = await this.client.get(`opportunities?$filter=_originatingleadid_value eq ${leadId}`);
    const oppData = await oppRes.json();
    return {
      value: [
        {
          '@odata.type': '#Microsoft.Dynamics.CRM.opportunity',
          opportunityid: oppData.value && oppData.value.length > 0 ? oppData.value[0].opportunityid : undefined
        }
      ]
    };
  }

  async deleteLead(leadId: string): Promise<void> {
    const response = await this.client.delete(`leads(${leadId})`);
    expect([204, 404]).toContain(response.status());
  }
}
