# ParaBank E2E Test Automation

**Playwright · TypeScript · Page Object Model · Allure Reporting · CI/CD**

> Automated E2E tests for the **ParaBank** demo banking application — covering a full user journey from registration through bill payment with API validation.

---

## Table of Contents

1. [Overview](#-1-overview)
2. [Project Structure](#-2-project-structure)
3. [Setup](#-3-setup)
4. [Running Tests](#-4-running-tests)
5. [CI/CD Pipeline](#-5-cicd-pipeline)
6. [Reporting](#-6-reporting)
7. [Tech Stack](#-7-tech-stack)

---

## 🌐 1. Overview

End-to-end test framework for [ParaBank](https://parabank.parasoft.com/), an online banking demo app. Validates the complete customer journey:

- User registration & login
- Navigation menu verification
- Account creation (Savings)
- Account overview balances
- Fund transfers
- Bill payment
- Transaction search via REST API

### Test Flow

```
Register → Login → Navigate → Open Account → View Overview → Transfer → Pay Bill → API Search
```

---

## 📁 2. Project Structure

```
.
├── playwright/
│   └── fixtures.ts                    # Custom test fixtures (PageManager, screenshots)
│
├── src/
│   ├── base/
│   │   └── BasePage.ts                # Base page object (shared UI helpers)
│   ├── constants/
│   │   └── api.constants.ts           # API base URL constant
│   ├── helpers/
│   │   └── transactionAssertions.ts   # Bill payment transaction assertions
│   ├── services/
│   │   └── TransactionApiService.ts   # Transaction API client
│   ├── types/
│   │   └── transaction.types.ts       # Transaction interfaces
│   ├── ui/
│   │   ├── PageManager.ts             # Lazy-loaded page object hub
│   │   ├── locators/
│   │   │   ├── AccountOverviewLocators.ts
│   │   │   ├── BillPayLocators.ts
│   │   │   ├── HomeLocators.ts
│   │   │   ├── LoginLocators.ts
│   │   │   ├── OpenAccountLocators.ts
│   │   │   ├── RegistrationLocators.ts
│   │   │   └── TransferFundsLocators.ts
│   │   └── pages/
│   │       ├── AccountOverviewPage.ts
│   │       ├── BillPayPage.ts
│   │       ├── HomePage.ts
│   │       ├── LoginPage.ts
│   │       ├── OpenAccountPage.ts
│   │       ├── RegistrationPage.ts
│   │       └── TransferFundsPage.ts
│   └── utils/
│       ├── DataGenerator.ts           # Faker-based test data generation
│       └── Logger.ts                  # Structured test logging
│
├── tests/
│   └── ui/
│       └── parabankFullFlow.spec.ts   # Full E2E journey (UI + API validation)
│
├── .github/workflows/
│   ├── playwright.yml                 # CI pipeline definition
│   ├── generate-report.js             # Email report HTML generator
│   └── generate-summary.js            # Test summary parser
│
├── playwright.config.ts
├── tsconfig.json
├── package.json
└── .env                               # Secrets (gitignored)
```

---

## 🛠️ 3. Setup

### Prerequisites

- Node.js 18+
- npm

### Install

```bash
npm ci
npx playwright install chromium --with-deps
```

### Environment

Create `.env` in the project root:

```env
BASE_URL=https://parabank.parasoft.com
```

---

## ▶️ 4. Running Tests

```bash
# Full test suite
npx playwright test

# UI project only
npx playwright test --project=UI

# With Allure reporting
npx playwright test --reporter=list,allure-playwright
```

---

## 🔄 5. CI/CD Pipeline

The workflow in `.github/workflows/playwright.yml`:

- **Trigger:** Push or PR to `main`
- **Project:** UI (Chromium)
- **Steps:**
  1. Install dependencies & browsers
  2. Run Playwright tests
  3. Upload HTML report (14-day retention)
  4. Generate Allure test summary
  5. Send email report (if SMTP secrets configured)

### Email Report Setup

Add these GitHub repository secrets:

| Secret | Description |
|---|---|
| `MAIL_USERNAME` | SMTP login (e.g., Gmail address) |
| `MAIL_PASSWORD` | SMTP password / app password |
| `MAIL_TO` | Recipient email address |

Default SMTP: `smtp.gmail.com:587` (override via `MAIL_SERVER` / `MAIL_PORT`).

---

## 📊 6. Reporting

| Report | Location | Access |
|---|---|---|
| Playwright HTML | `reports/html/` | `npx playwright show-report` |
| Allure | `allure-results/` | Run page artifacts (CI) |
| Email | Inbox | Sent via pipeline after completion |

- **Screenshots:** Captured on failure
- **Trace viewer:** Captured on first retry
- **Video:** Retained on failure

---

## 🧰 7. Tech Stack

| Tool | Purpose |
|---|---|
| [Playwright](https://playwright.dev) | Browser automation & API testing |
| [TypeScript](https://www.typescriptlang.org) | Type safety |
| [Allure](https://qameta.io/allure-report) | Test reporting |
| [Faker](https://fakerjs.dev) | Test data generation |
| [GitHub Actions](https://github.com/features/actions) | CI/CD |
| [action-send-mail](https://github.com/marketplace/actions/send-email) | Email notifications |

---

<div align="center">

Built with [Playwright](https://playwright.dev) · [TypeScript](https://www.typescriptlang.org) · [ParaBank](https://parabank.parasoft.com)

</div>
