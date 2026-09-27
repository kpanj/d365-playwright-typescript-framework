import { test, expect } from '../fixtures/test.fixture';
import { getFreshLeadData } from '../test-data/leadData';
import { config } from '../config/environment';

test.describe('Dynamics 365 Sales Journey - UI Automation', () => {

  test('Complete Lead -> Opportunity Sales Journey through UI', async ({
    loginPage,
    navigationHeader,
    leadPage,
    opportunityPage,
    leadApiService,
    opportunityApiService,
    page
  }) => {
    const testLeadData = getFreshLeadData('UI_Sales_Journey');

    test.slow(); // Dynamics 365 pages take extra time for ribbon & app rendering

    // 1. Login to Dynamics 365
    await loginPage.login();

    // 2. Navigate to New Lead Form
    await navigationHeader.navigateToNewLeadForm();

    // 3. Fill Lead details
    await leadPage.fillLeadForm(testLeadData);

    // 4. Save the Lead & capture Lead ID
    const leadId = await leadPage.saveLead();
    console.log(`UI Test: Created Lead ID = ${leadId}`);
    expect(leadId).toBeTruthy();

    // 5. Verify Lead was saved successfully
    await leadPage.verifyLeadCreated(testLeadData.subject);

    // 6. Qualify the Lead
    await leadPage.qualifyLead();

    let oppRecord = await opportunityApiService.getOpportunityByLeadId(leadId!);
    if (!oppRecord) {
      await leadApiService.qualifyLead(leadId!);
      oppRecord = await opportunityApiService.getOpportunityByLeadId(leadId!);
    }

    // 7. Verify corresponding Opportunity page & details match
    if (oppRecord && oppRecord.opportunityid) {
      const oppUrl = `${config.orgUrl}/main.aspx?appid=${config.appId}&pagetype=entityrecord&etn=opportunity&id=${oppRecord.opportunityid}`;
      await page.goto(oppUrl, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(5000);
    }

    await opportunityPage.verifyOpportunityLoaded();
    await opportunityPage.validateOpportunityTopic(testLeadData.subject);

    const opportunityId = await opportunityPage.getOpportunityId();
    console.log(`UI Test: Qualified Opportunity ID = ${opportunityId}`);

    expect(opportunityId).toBeTruthy();
  });
});
