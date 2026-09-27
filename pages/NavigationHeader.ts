import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { config } from '../config/environment';

export class NavigationHeader extends BasePage {
  readonly siteMapButton: Locator;
  readonly leadsNavItem: Locator;
  readonly opportunitiesNavItem: Locator;

  constructor(page: Page) {
    super(page);
    this.siteMapButton = page.locator('button[data-id="navbutton"], button[aria-label="Site Map"]');
    this.leadsNavItem = page.locator('[aria-label="Leads"], [data-id="sitemap-node-lead"]');
    this.opportunitiesNavItem = page.locator('[aria-label="Opportunities"], [data-id="sitemap-node-opportunity"]');
  }

  async navigateToLeads(): Promise<void> {
    const leadsUrl = `${config.orgUrl}/main.aspx?appid=${config.appId}&pagetype=entitylist&etn=lead`;
    await this.navigateTo(leadsUrl);
    await this.waitForTimeout(5000);
  }

  async navigateToNewLeadForm(): Promise<void> {
    const newLeadUrl = `${config.orgUrl}/main.aspx?appid=${config.appId}&pagetype=entityrecord&etn=lead`;
    await this.navigateTo(newLeadUrl);
    await this.waitForTimeout(5000);
  }

  async navigateToOpportunities(): Promise<void> {
    const oppUrl = `${config.orgUrl}/main.aspx?appid=${config.appId}&pagetype=entitylist&etn=opportunity`;
    await this.navigateTo(oppUrl);
    await this.waitForTimeout(5000);
  }
}
