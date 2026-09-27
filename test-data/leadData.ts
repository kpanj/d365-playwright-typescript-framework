import { LeadTestData, TestDataGenerator } from '../utils/testDataGenerator';

export const staticLeadData: LeadTestData = {
  subject: 'Static Interview Demo Lead',
  firstName: 'John',
  lastName: 'Doe',
  companyName: 'Microsoft Partner Inc',
  jobTitle: 'Sales Director',
  email: 'john.doe@partnerinc.com',
  phone: '425-555-0100',
  mobilePhone: '425-555-0199'
};

export function getFreshLeadData(prefix?: string): LeadTestData {
  return TestDataGenerator.generateLeadData(prefix);
}
