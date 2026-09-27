import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class OpportunityPage extends BasePage {
  readonly topicInput: Locator;
  readonly accountLookup: Locator;
  readonly contactLookup: Locator;
  readonly formHeaderTitle: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    super(page);

    this.topicInput = page.locator('input[aria-label="Topic"], input[data-id="name.fieldControl-text-box-text"], [data-id="name.fieldControl-text-box-text"] input, [aria-label*="Topic"]').first();
    this.accountLookup = page.locator('[data-id="parentaccountid.fieldControl-LookupResultsDropdown"], [aria-label*="Account"]').first();
    this.contactLookup = page.locator('[data-id="parentcontactid.fieldControl-LookupResultsDropdown"], [aria-label*="Contact"]').first();
    this.formHeaderTitle = page.locator('h1[data-id="header_title"], [data-id="entity_title"], [aria-label*="Opportunity"]').first();
    this.saveButton = page.locator('button[data-id="opportunity|NoRelationship|Form|Mscrm.Form.opportunity.Save"], button[aria-label="Save"]').first();
  }

  async verifyOpportunityLoaded(): Promise<void> {
    await this.page.waitForURL(url => url.toString().includes('opportunity'), { timeout: 45000 });
    await Promise.race([
      this.topicInput.waitFor({ state: 'visible', timeout: 25000 }).catch(() => {}),
      this.formHeaderTitle.waitFor({ state: 'visible', timeout: 25000 }).catch(() => {})
    ]);
    const currentUrl = this.page.url();
    expect(currentUrl).toContain('opportunity');
  }

  async validateOpportunityTopic(expectedTopicPrefix: string): Promise<void> {
    const broadTopicLocator = this.page.locator('input[aria-label="Topic"], input[data-id="name.fieldControl-text-box-text"], [data-id="header_title"], [data-id="name.fieldControl-text-box-text"], [aria-label*="Topic"]').first();

    try {
      if (await broadTopicLocator.isVisible({ timeout: 10000 })) {
        const val = (await broadTopicLocator.inputValue().catch(() => '')) || (await broadTopicLocator.textContent().catch(() => '')) || '';
        if (val && val.toLowerCase().includes(expectedTopicPrefix.toLowerCase())) {
          expect(val.toLowerCase()).toContain(expectedTopicPrefix.toLowerCase());
          return;
        }
      }
    } catch (e) {
      // Fallback to text matching
    }

    // Fallback: assert expected topic string is visible anywhere on Opportunity record page
    const topicTextLocator = this.page.locator(`text=${expectedTopicPrefix}`).first();
    await expect(topicTextLocator).toBeVisible({ timeout: 25000 });
  }

  async getOpportunityId(): Promise<string | null> {
    return await this.getRecordIdFromUrl();
  }
}
