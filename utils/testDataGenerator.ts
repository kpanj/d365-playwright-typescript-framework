export interface LeadTestData {
  subject: string;
  firstName: string;
  lastName: string;
  companyName: string;
  jobTitle: string;
  email: string;
  phone: string;
  mobilePhone: string;
}

export class TestDataGenerator {
  public static generateLeadData(prefix = 'AutoLead'): LeadTestData {
    const timestamp = Date.now();
    const randomSuffix = Math.floor(Math.random() * 100000);

    return {
      subject: `${prefix} ${timestamp}`,
      firstName: `QA_${randomSuffix}`,
      lastName: `Candidate_${timestamp}`,
      companyName: `Corp_${timestamp}_${randomSuffix}`,
      jobTitle: 'Automation Lead',
      email: `qa.cand_${timestamp}_${randomSuffix}@testdomain.org`,
      phone: `555${String(randomSuffix).padStart(7, '0')}`,
      mobilePhone: `555${String(randomSuffix + 1).padStart(7, '0')}`
    };
  }
}
