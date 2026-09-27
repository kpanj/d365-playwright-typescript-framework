import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { LeadTestData } from '../utils/testDataGenerator';
import { config } from '../config/environment';

export class LeadPage extends BasePage {
  // Command Bar Locators
  readonly newLeadButton: Locator;
  readonly saveButton: Locator;
  readonly qualifyButton: Locator;

  // Lead Form Locators
  readonly topicInput: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly jobTitleInput: Locator;
  readonly phoneInput: Locator;
  readonly mobileInput: Locator;
  readonly emailInput: Locator;
  readonly companyInput: Locator;

  // Header / Title elements
  readonly formHeaderTitle: Locator;
  readonly qualifyProcessStage: Locator;

  constructor(page: Page) {
    super(page);

    // Command Bar
    this.newLeadButton = page.locator('button[data-id="lead|NoRelationship|Form|Mscrm.Form.lead.NewRecord"], button[data-id*="lead.NewRecord"], button[aria-label*="Create a new Lead record"]').first();
    this.saveButton = page.locator('button[data-id="lead|NoRelationship|Form|Mscrm.Form.lead.Save"], button[aria-label*="Save (CTRL+S)"], button[aria-label="Save"]').first();
    this.qualifyButton = page.locator('button[data-id="lead|NoRelationship|Form|Mscrm.Form.lead.Qualify"], button[aria-label*="Qualify"]').first();

    // Inputs using aria-label and fallback data-id
    this.topicInput = page.locator('input[aria-label="Topic"], input[data-id="subject.fieldControl-text-box-text"]').first();
    this.firstNameInput = page.locator('input[aria-label="First Name"], input[data-id="fullname_compositionLinkControl_firstname.fieldControl-text-box-text"]').first();
    this.lastNameInput = page.locator('input[aria-label="Last Name"], input[data-id="fullname_compositionLinkControl_lastname.fieldControl-text-box-text"]').first();
    this.jobTitleInput = page.locator('input[aria-label="Job Title"], input[data-id="jobtitle.fieldControl-text-box-text"]').first();
    this.phoneInput = page.locator('input[aria-label="Business Phone"], input[data-id="telephone1.fieldControl-phone-text-input"]').first();
    this.mobileInput = page.locator('input[aria-label="Mobile Phone"], input[data-id="mobilephone.fieldControl-phone-text-input"]').first();
    this.emailInput = page.locator('input[aria-label="Email"], input[data-id="emailaddress1.fieldControl-mail-text-input"]').first();
    this.companyInput = page.locator('input[aria-label="Company"], input[data-id="companyname.fieldControl-text-box-text"]').first();

    // Header & Stage
    this.formHeaderTitle = page.locator('h1[data-id="header_title"], [aria-label*="Lead entity"]').first();
    this.qualifyProcessStage = page.locator('[data-id*="ProcessBreadCrumb"]').first();
  }

  async fillLeadForm(data: LeadTestData): Promise<void> {
    await this.topicInput.waitFor({ state: 'visible', timeout: 20000 });
    await this.topicInput.fill(data.subject);

    if (await this.firstNameInput.isVisible()) {
      await this.firstNameInput.fill(data.firstName);
    }
    if (await this.lastNameInput.isVisible()) {
      await this.lastNameInput.fill(data.lastName);
    }
    if (await this.companyInput.isVisible()) {
      await this.companyInput.fill(data.companyName);
    }
    if (await this.jobTitleInput.isVisible()) {
      await this.jobTitleInput.fill(data.jobTitle);
    }
    if (await this.emailInput.isVisible()) {
      await this.emailInput.fill(data.email);
    }
    if (await this.phoneInput.isVisible()) {
      await this.phoneInput.fill(data.phone);
    }
  }

  async saveLead(): Promise<string | null> {
    await this.saveButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.saveButton.click();

    // Auto-wait for D365 to commit record and update browser URL with entity ID GUID (&id=)
    try {
      await this.page.waitForURL(url => /[\?&]id=([a-f0-9-]{36})/i.test(url.toString()), { timeout: 25000 });
    } catch (e) {
      await this.waitForTimeout(5000);
    }

    let recordId = await this.getRecordIdFromUrl();

    // Fallback retry loop if URL update is slightly delayed by D365 background plugins
    let attempts = 0;
    while (!recordId && attempts < 3) {
      attempts++;
      await this.waitForTimeout(3000);
      recordId = await this.getRecordIdFromUrl();
    }

    return recordId;
  }

  async verifyLeadCreated(expectedSubject: string): Promise<void> {
    const currentSubject = await this.topicInput.inputValue();
    expect(currentSubject).toBe(expectedSubject);
  }

  async qualifyLead(): Promise<void> {
    const qualifyBtn = this.page.locator('button[data-id*="Mscrm.Form.lead.Qualify"], button[aria-label="Qualify"], button[aria-label*="Qualify"]').first();

    try {
      if (await qualifyBtn.isVisible({ timeout: 5000 })) {
        await qualifyBtn.click();
      } else {
        const overflowBtn = this.page.locator('button[aria-label="More commands"], button[data-id*="OverflowButton"]').first();
        if (await overflowBtn.isVisible({ timeout: 5000 })) {
          await overflowBtn.click();
          await this.waitForTimeout(1000);
        }
        await qualifyBtn.click();
      }
    } catch (e) {
      await qualifyBtn.click({ force: true }).catch(() => {});
    }

    await this.waitForTimeout(4000);

    // Click OK / Confirm / Save & Continue on any D365 modal dialog
    try {
      const modalButtons = this.page.locator('button[aria-label="OK"], button[aria-label="Confirm"], button[aria-label*="Save"], button:has-text("OK"), button:has-text("Qualify")');
      if (await modalButtons.first().isVisible({ timeout: 4000 })) {
        await modalButtons.first().click().catch(() => {});
      }
    } catch (e) {
      // Dialog not present
    }

    await this.waitForTimeout(5000);

    // Verify URL or navigate to Opportunity page
    if (!this.page.url().includes('opportunity')) {
      const oppListUrl = `${config.orgUrl}/main.aspx?appid=${config.appId}&pagetype=entitylist&etn=opportunity`;
      await this.navigateTo(oppListUrl);
    }
  }
}
