import { test, expect } from '../fixtures/test.fixture';
import { getFreshLeadData } from '../test-data/leadData';

test.describe('Dynamics 365 Web API - Sales Journey Automation', () => {

  test('Create, Read, Qualify Lead & Verify Opportunity via D365 Web API', async ({
    leadApiService,
    opportunityApiService
  }) => {
    const testLeadData = getFreshLeadData('API_Sales_Journey');

    // 1. Create Lead via Web API
    const createdLead = await leadApiService.createLead(testLeadData);
    const leadId = createdLead.leadid;
    console.log(`API Test: Created Lead ID = ${leadId}`);
    expect(leadId).toBeTruthy();

    // 2. Fetch Lead via Web API & Validate fields
    const fetchedLead = await leadApiService.getLeadById(leadId);
    expect(fetchedLead.subject).toBe(testLeadData.subject);
    expect(fetchedLead.companyname).toBe(testLeadData.companyName);
    expect(fetchedLead.statecode).toBe(0); // 0 = Open

    // 3. Qualify Lead via Web API Action
    const qualifyResult = await leadApiService.qualifyLead(leadId);
    expect(qualifyResult.value).toBeDefined();

    // 4. Extract and validate created Opportunity entity from response
    const createdOppEntity = qualifyResult.value.find(
      entity => entity['@odata.type'] === '#Microsoft.Dynamics.CRM.opportunity'
    );
    expect(createdOppEntity).toBeDefined();

    const opportunityId = createdOppEntity?.opportunityid;
    console.log(`API Test: Created Opportunity ID = ${opportunityId}`);

    // 5. Fetch resulting Opportunity via Web API & Verify relation
    if (opportunityId) {
      const oppDetails = await opportunityApiService.getOpportunityById(opportunityId);
      expect(oppDetails.name).toContain(testLeadData.subject);
      expect(oppDetails._originatingleadid_value).toBe(leadId);
    }
  });
});
