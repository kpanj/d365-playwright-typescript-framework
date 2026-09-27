import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export const config = {
  baseUrl: process.env.D365_URL || 'https://org39107662.crm8.dynamics.com/main.aspx?appid=47398771-c64c-f111-bec6-7ced8daf1936',
  orgUrl: process.env.D365_ORG_URL || 'https://org39107662.crm8.dynamics.com',
  username: process.env.D365_USERNAME || 'DemoUser@Indivitual633.onmicrosoft.com',
  password: process.env.D365_PASSWORD || 'September@2026#$',
  appId: '47398771-c64c-f111-bec6-7ced8daf1936',
  apiBaseUrl: `${process.env.D365_ORG_URL || 'https://org39107662.crm8.dynamics.com'}/api/data/v9.2`,
  storageStatePath: path.resolve(process.cwd(), 'storageState.json')
};
