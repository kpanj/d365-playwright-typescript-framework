import { test as base, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { LeadPage } from '../pages/LeadPage';
import { OpportunityPage } from '../pages/OpportunityPage';
import { NavigationHeader } from '../pages/NavigationHeader';
import { D365ApiClient } from '../api/D365ApiClient';
import { LeadApiService } from '../api/LeadApiService';
import { OpportunityApiService } from '../api/OpportunityApiService';
import { config } from '../config/environment';

export type CustomFixtures = {
  loginPage: LoginPage;
  leadPage: LeadPage;
  opportunityPage: OpportunityPage;
  navigationHeader: NavigationHeader;
  apiClient: D365ApiClient;
  leadApiService: LeadApiService;
  opportunityApiService: OpportunityApiService;
};

export const test = base.extend<CustomFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  leadPage: async ({ page }, use) => {
    await use(new LeadPage(page));
  },
  opportunityPage: async ({ page }, use) => {
    await use(new OpportunityPage(page));
  },
  navigationHeader: async ({ page }, use) => {
    await use(new NavigationHeader(page));
  },
  apiClient: async ({ page }, use) => {
    const client = new D365ApiClient(page.request);
    await use(client);
  },
  leadApiService: async ({ apiClient }, use) => {
    await use(new LeadApiService(apiClient));
  },
  opportunityApiService: async ({ apiClient }, use) => {
    await use(new OpportunityApiService(apiClient));
  }
});

export { expect } from '@playwright/test';
