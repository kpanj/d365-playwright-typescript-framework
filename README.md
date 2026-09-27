# Enterprise Playwright + TypeScript Automation Framework for Microsoft Dynamics 365 Sales

An enterprise-grade, interview-ready test automation framework designed for **Microsoft Dynamics 365 Sales Hub** built with **Playwright**, **TypeScript**, and **Page Object Model (POM)** architecture.

This framework covers the complete **Lead-to-Opportunity Sales Journey** across UI, REST/OData Web API, and Hybrid UI+API execution layers.

---

## 📌 Features & Highlights

- **Page Object Model (POM)**: Strong object-oriented separation between locators, page actions, and test scripts.
- **Always-Headed Execution**: Configured to run all tests in headed mode (`headless: false`) for visual inspection of CRM actions and UI interactions.
- **Authentication Session Reuse**: Automated SSO authentication (`auth.setup.ts`) saving `storageState.json` to eliminate repeated log-in steps and bypass session overhead.
- **Dynamics 365 OData Web API Integration**: Native API service layer communicating with D365 Web API (`v9.2`), including Lead creation, entity retrieval, eTag optimistic concurrency handling, and bound OData actions (`QualifyLead`).
- **Hybrid UI + API Correlation**: Seed and qualify records instantly via Web API, then navigate and visually inspect resulting Opportunity forms in Playwright UI.
- **Dynamic Data Generation**: Unique test data generation (`testDataGenerator.ts`) to avoid duplicate record collisions in D365 environment.
- **Rich Reporting & Artifacts**: HTML report generation (`playwright-report`), list console progress, auto-capture of screenshots, traces, and videos on failure.

---

## 📁 Framework Architecture

```
CRMAutomationInterview/
├── api/                             # Web API Service Layer
│   ├── D365ApiClient.ts            # OData API request client wrapper
│   ├── LeadApiService.ts             # Web API CRUD & QualifyLead action service
│   └── OpportunityApiService.ts      # Web API Opportunity service
├── config/                          # Environment Configuration
│   └── environment.ts              # Config reader (.env parser)
├── fixtures/                        # Custom Playwright Fixtures
│   └── test.fixture.ts             # Injected POM & API service instances
├── pages/                           # Page Object Model Classes
│   ├── BasePage.ts                 # Base page with common locators, typing, regex ID helpers
│   ├── LoginPage.ts                # Microsoft SSO login handler
│   ├── NavigationHeader.ts         # Navigation bar & entity menu handler
│   ├── LeadPage.ts                 # Lead creation, saving & qualification page
│   └── OpportunityPage.ts          # Opportunity form & validation page
├── test-data/                       # Test Data & Factories
│   └── leadData.ts                 # Dynamic Lead model generator
├── tests/                           # Test Specs
│   ├── auth.setup.ts               # Setup project saving storage state
│   ├── lead-to-opportunity.ui.spec.ts     # E2E UI Test Suite
│   ├── lead-to-opportunity.api.spec.ts    # Web API OData Test Suite
│   └── lead-to-opportunity.hybrid.spec.ts # Hybrid UI + API correlation suite
├── .env                             # Environment Credentials (Git-ignored)
├── .gitignore                       # Git ignore configuration
├── package.json                     # Scripts & Dependencies
├── playwright.config.ts             # Playwright Configuration
└── README.md                        # Documentation
```

---

## ⚙️ Configuration & Setup

### 1. Prerequisites
- **Node.js**: v18 or higher
- **npm**: v9 or higher

### 2. Environment Variables (.env)
Create a `.env` file in the root directory:
```ini
D365_ORG_URL=https://your-org.crm8.dynamics.com
D365_APP_ID=47398771-c64c-f111-bec6-7ced8daf1936
D365_USERNAME=your-username@yourdomain.onmicrosoft.com
D365_PASSWORD="YourSecurePasswordHere#$"
```
> **Note:** Enclose passwords containing `#` in double quotes to prevent dotenv inline comment truncation.

---

## 🚀 Running Tests (Always Headed Mode)

All test scripts execute in **headed mode** (`headless: false`) as configured in `playwright.config.ts` and package scripts.

| Command | Description |
|---|---|
| `npm test` | Runs all test suites (UI, API, Hybrid) in headed mode |
| `npm run test:ui` | Executes End-to-End UI Lead → Opportunity sales journey |
| `npm run test:api` | Executes Web API OData Lead creation, qualification & validation |
| `npm run test:hybrid` | Executes Hybrid API creation + UI validation suite |
| `npm run test:headed` | Explicit headed execution trigger |
| `npm run report` | Opens interactive Playwright HTML Test Report |

---

## 💡 Key Architectural Concepts & Interview Talking Points

### 1. Session Storage State Authentication (`auth.setup.ts`)
To handle Microsoft Azure AD / SSO login efficiently, the `setup` project logs into Dynamics 365 once, waits for app session cookies to finalize, and exports `storageState.json`. Subsequent test projects (`ui`, `api`, `hybrid`) re-use this saved state, dramatically accelerating test execution.

### 2. Dynamics 365 Web API Action for Lead Qualification
Qualifying a Lead in Dynamics 365 via Web API requires calling a bound OData Action:
- **Endpoint:** `POST /api/data/v9.2/leads(leadId)/Microsoft.Dynamics.CRM.QualifyLead`
- **Headers:** `'If-Match': etag` (optimistic concurrency control)
- **Payload:**
  ```json
  {
    "CreateAccount": true,
    "CreateContact": true,
    "CreateOpportunity": true,
    "Status": 3
  }
  ```
The action returns `200 OK` containing the array of newly created Account, Contact, and Opportunity entity references.

### 3. Dynamic GUID Extraction from D365 URLs
In Dynamics 365, entity record URLs contain GUIDs (`&id=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`). The `BasePage` utility uses regex `/[\?&]id=([a-f0-9-]{36})/i` to dynamically extract record IDs after saving or qualifying, avoiding brittle DOM locator dependencies.

---

## 📊 Reporting & Failures

View detailed HTML test reports and trace files after execution:
```bash
npm run report
```
If a test fails, Playwright captures:
- Screenshots in `test-results/`
- Execution video recordings
- Complete Playwright Trace zip files viewable with `npx playwright show-trace`
