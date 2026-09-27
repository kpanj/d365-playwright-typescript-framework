import { test, expect } from '../fixtures/test.fixture';
import { getFreshLeadData } from '../test-data/leadData';
import { config } from '../config/environment';

test.describe('Dynamics 365 Hybrid UI + API Correlation Suite', () => {

  test('Create & Qualify Lead via Web API -> Validate Resulting Opportunity in UI & API', async ({
    loginPage,
    opportunityPage,
    leadApiService,
    opportunityApiService,
    page
  }) => {
    const testLeadData = getFreshLeadData('Hybrid_Sales_Journey');

    // 1. UI: Authenticate & initialize D365 session context
    await loginPage.login();

    // 2. API: Create Lead via Web API
    const createdLead = await leadApiService.createLead(testLeadData);
    const leadId = createdLead.leadid;
    console.log(`Hybrid Test: API Created Lead ID = ${leadId}`);
    expect(leadId).toBeTruthy();

    // 2. API: Qualify Lead via Web API OData Action
    const qualifyResult = await leadApiService.qualifyLead(leadId);
    const createdOppEntity = qualifyResult.value.find(
      entity => entity['@odata.type'] === '#Microsoft.Dynamics.CRM.opportunity'
    );
    expect(createdOppEntity).toBeDefined();

    const oppIdFromApi = createdOppEntity?.opportunityid;
    console.log(`Hybrid Test: API Qualified Opportunity ID = ${oppIdFromApi}`);
    expect(oppIdFromApi).toBeTruthy();

    // 3. UI: Authenticate & navigate directly to the API-qualified Opportunity record page
    await loginPage.login();
    const oppFormUrl = `${config.orgUrl}/main.aspx?appid=${config.appId}&pagetype=entityrecord&etn=opportunity&id=${oppIdFromApi}`;
    await page.goto(oppFormUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(6000);

    // 4. UI: Verify Opportunity form loaded and topic matches
    await opportunityPage.verifyOpportunityLoaded();
    await opportunityPage.validateOpportunityTopic(testLeadData.subject);

    // 5. API: Cross-validate Opportunity details from API
    if (oppIdFromApi) {
      const oppFromApi = await opportunityApiService.getOpportunityById(oppIdFromApi);
      expect(oppFromApi.opportunityid).toBe(oppIdFromApi);
      expect(oppFromApi._originatingleadid_value).toBe(leadId);
    }
  });
});
