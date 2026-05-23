# 🏦 ParaBank Automation Framework
**Playwright · TypeScript · Page Object Model · API + UI + Hybrid**

> **Author:** Your Name
> LinkedIn: https://www.linkedin.com/in/your-profile/
> GitHub: https://github.com/yourusername/parabank-automation

---

## 📋 Table of Contents

1. [Project Overview](#-1-project-overview)
2. [Framework Quality & Compliance](#-2-framework-quality--compliance)
3. [Installation & Environment Setup](#️-3-installation--environment-setup)
4. [Project Structure](#-4-project-structure)
5. [Architecture Deep Dive](#-5-architecture-deep-dive)
6. [Running Tests](#-6-running-tests)
7. [Test Coverage](#-7-test-coverage)
8. [Reporting](#-8-reporting)
9. [CI/CD Integration](#-9-cicd-integration)
10. [ParaBank URL Reference](#-10-parabank-url-reference)
11. [Contributing](#-11-contributing)

---

## 🌐 1. Project Overview

This framework automates functional testing of the **ParaBank demo banking application**, an open-source web app by Parasoft that simulates a real online banking portal. It validates the complete customer banking journey — from account registration through fund transfers, bill pay, and loan requests — across three test layers:

| Layer | Purpose | Example |
|---|---|---|
| **UI** | Visual and functional browser tests | Login form validation, account overview interactions |
| **API** | Backend contract and data integrity tests | REST endpoints for accounts, transactions, transfers |
| **Hybrid** | Speed-optimized: API sets up state, UI verifies | API creates account → UI verifies balance and details |

**Application under test:**

| | |
|---|---|
| 🌍 Base URL | `https://parabank.parasoft.com/parabank` |
| 🧪 Type | Online Banking Demo (Java / Spring) |
| 🔌 REST API Base | `/parabank/services/bank` |
| 🧼 SOAP Services | `/parabank/services/ParaBank` |
| 📖 OpenAPI Docs | `/parabank/api-docs/index.html` |
| 👤 Key Flows | Register, Login, Open Account, Transfer Funds, Bill Pay, Loan Request, Transaction History |

---

## ✅ 2. Framework Quality & Compliance

This framework implements **Playwright best practices** validated against official documentation.

### Architecture Strengths

- ✅ **Custom Fixture Pattern** — Uses `test.extend<Fixtures>` injecting `{ pm, am }` into every spec, matching Playwright docs exactly
- ✅ **Page Object Model** — `PageManager` with lazy-loaded page instances (`??=`) for zero-overhead scalability
- ✅ **Component Abstraction** — `BaseComponent` scopes all locator calls to a root element, eliminating cross-component selector collisions
- ✅ **Standardized Actions** — `BasePage` wraps all Playwright interactions; specs never call `page.click()` directly
- ✅ **Web-First Assertions** — `waitFor({ state: 'visible' })` enforced before every action in `BasePage` (prevents flakiness)
- ✅ **Centralized Selectors** — All selectors live in `/locators` files — one place to update when the UI changes
- ✅ **TypeScript Strict Mode** — Full type safety across fixtures, page objects, controllers, and API models
- ✅ **Multi-Browser Ready** — Playwright projects configured for Chromium, Firefox, and WebKit
- ✅ **CI/Dev Split** — Retries, workers, and reporters tuned separately for local dev vs. CI pipeline
- ✅ **Hybrid Test Category** — Dedicated `tests/hybrid/` layer eliminates slow UI setup by using REST API to pre-build state

### Why This Architecture Works

- **Maintainability:** Selectors in `/locators`, actions in `/pages`, orchestration in `/tests` — each concern has exactly one home
- **Reliability:** `BasePage` enforces web-first assertions; `BaseComponent` prevents scoping bugs; trace + video retained on failure
- **Scalability:** Lazy-loaded managers let you add new pages or controllers without touching any existing code
- **Speed:** Hybrid tests skip UI setup for test preconditions — API calls that take ~200ms replace UI flows that take 5–10 seconds
- **Readability:** Every spec imports a single fixture file; test bodies read like plain English banking flows

---

## 🛠️ 3. Installation & Environment Setup

### Step 1: Prerequisites

| Tool | Version |
|---|---|
| Node.js | 18+ (LTS recommended) |
| npm | 9+ |
| Git | Any recent version |

### Step 2: Clone the repository

```bash
#TODO: Update link
git clone https://github.com/
```

### Step 3: Install dependencies

```bash
npm ci
```

### Step 4: Install Playwright browsers

```bash
npx playwright install --with-deps
```

### Step 5: Configure environment variables

Create a `.env` file in the repository root:

```env
# Application
BASE_URL=https://parabank.parasoft.com/parabank
API_BASE_URL=https://parabank.parasoft.com/parabank/services/bank

# Registered test customer
TEST_USER_USERNAME=john
TEST_USER_PASSWORD=demo

# Admin credentials (for DB reset via Admin page)
ADMIN_URL=https://parabank.parasoft.com/parabank/admin.htm
```

> ⚠️ **Never commit `.env` to source control.** It is already listed in `.gitignore`.

---

## 📁 4. Project Structure

```
parabank-automation/
├── playwright/                             # FRAMEWORK EXTENSIONS
│   └── fixtures.ts                         # Custom test extension (Injects { pm, am })
│
├── src/                                    # THE CORE ENGINE (Business Logic)
│   ├── base/                               # THE FOUNDATION
│   │   ├── BasePage.ts                     # Global UI wrappers (click, fill, navigate, etc.)
│   │   ├── BaseComponent.ts                # Scoped root locator logic
│   │   └── BaseController.ts               # Global API wrappers (get, post, put, delete)
│   │
│   ├── ui/                                 # UI LAYER
│   │   ├── PageManager.ts                  # UI Hub (lazy-loads all Page Objects)
│   │   ├── pages/
│   │   │   ├── HomePage.ts                 # /index.htm  — Login panel, news, ATM/Online service links
│   │   │   ├── LoginPage.ts                # /index.htm  — Username/password login form
│   │   │   ├── RegisterPage.ts             # /register.htm  — New customer registration form
│   │   │   ├── AccountOverviewPage.ts      # /overview.htm  — Account list, balances
│   │   │   ├── AccountDetailsPage.ts       # /activity.htm  — Transaction history for an account
│   │   │   ├── OpenAccountPage.ts          # /openaccount.htm  — Open Checking or Savings account
│   │   │   ├── TransferFundsPage.ts        # /transfer.htm  — Transfer between own accounts
│   │   │   ├── BillPayPage.ts              # /billpay.htm  — Pay a bill to a payee
│   │   │   ├── FindTransactionsPage.ts     # /findtrans.htm  — Search transactions by date/amount/id
│   │   │   ├── RequestLoanPage.ts          # /requestloan.htm  — Submit a loan application
│   │   │   ├── UpdateProfilePage.ts        # /updateprofile.htm  — Edit personal information
│   │   │   ├── LookupPage.ts               # /lookup.htm  — Forgot login info (username lookup)
│   │   │   ├── ContactPage.ts              # /contact.htm  — Contact Us form
│   │   │   ├── AboutPage.ts                # /about.htm  — About ParaBank
│   │   │   └── AdminPage.ts                # /admin.htm  — DB initialize/reset controls
│   │   │
│   │   ├── components/
│   │   │   ├── HeaderComponent.ts          # Logo, nav links (Home, About, Contact)
│   │   │   ├── LeftNavComponent.ts         # Sidebar menu (Account Overview, Transfer, Bill Pay, etc.)
│   │   │   ├── LoginPanelComponent.ts      # Login form panel on home page
│   │   │   ├── ErrorMessageComponent.ts    # Inline validation/error messages
│   │   │   └── NewsComponent.ts            # Latest news items on home page
│   │   │
│   │   └── locators/
│   │       ├── HomeLocators.ts
│   │       ├── LoginLocators.ts
│   │       ├── RegisterLocators.ts
│   │       ├── AccountOverviewLocators.ts
│   │       ├── AccountDetailsLocators.ts
│   │       ├── OpenAccountLocators.ts
│   │       ├── TransferFundsLocators.ts
│   │       ├── BillPayLocators.ts
│   │       ├── FindTransactionsLocators.ts
│   │       ├── RequestLoanLocators.ts
│   │       ├── UpdateProfileLocators.ts
│   │       └── LeftNavLocators.ts
│   │
│   ├── api/                                # API LAYER
│   │   ├── ApiManager.ts                   # API Hub (lazy-loads all Controllers)
│   │   ├── controllers/
│   │   │   ├── AuthController.ts           # POST /login, /logout (form-based session auth)
│   │   │   ├── CustomerController.ts       # GET /customers/{id}, PUT update profile
│   │   │   ├── AccountController.ts        # GET /accounts/{id}, POST create account
│   │   │   ├── TransactionController.ts    # GET /accounts/{id}/transactions, GET /transactions/{id}
│   │   │   ├── TransferController.ts       # POST /transfer (fromAccount, toAccount, amount)
│   │   │   ├── BillPayController.ts        # POST /billpay?accountId={id} (payee + amount)
│   │   │   └── LoanController.ts           # POST /requestloan (customerId, amount, downPayment, fromAccountId)
│   │   │
│   │   └── models/
│   │       ├── CustomerInterface.ts        # { id, firstName, lastName, address, phone, ssn, username, password }
│   │       ├── AccountInterface.ts         # { id, customerId, type, balance }
│   │       ├── TransactionInterface.ts     # { id, accountId, type, date, amount, description }
│   │       ├── PayeeInterface.ts           # { name, address, city, state, zipCode, phoneNumber, accountNumber }
│   │       └── LoanResponseInterface.ts    # { loanProviderName, approved, message, accountId, responseDate }
│   │
│   └── utils/                              # SHARED HELPERS
│       ├── Logger.ts                       # Structured test logging
│       ├── DataGenerator.ts                # Faker wrappers (random name, address, SSN, account, etc.)
│       ├── CookieHelper.ts                 # Save/restore auth session via cookies
│       └── DbResetHelper.ts               # Calls Admin page to initialize/clean DB before test suites
│
├── tests/                                  # THE SPECS
│   ├── ui/
│   │   ├── auth/
│   │   │   ├── login.spec.ts               # Valid login, invalid credentials, empty fields, locked account
│   │   │   ├── register.spec.ts            # New customer, duplicate username, required field errors
│   │   │   ├── logout.spec.ts              # Session ends, sidebar disappears, redirect to home
│   │   │   └── forgotLogin.spec.ts         # Lookup via SSN + name, not found scenario
│   │   ├── accounts/
│   │   │   ├── overview.spec.ts            # Account list renders, balances shown, total displayed
│   │   │   ├── openAccount.spec.ts         # Open Checking/Savings, confirm new account number
│   │   │   └── accountDetails.spec.ts      # Transaction history, activity filter by date
│   │   ├── transactions/
│   │   │   ├── transfer.spec.ts            # Transfer between accounts, insufficient funds, same-account guard
│   │   │   ├── billPay.spec.ts             # Pay bill, invalid payee, missing fields, confirm receipt
│   │   │   └── findTransactions.spec.ts    # Search by id, date, date range, amount
│   │   ├── loan/
│   │   │   └── requestLoan.spec.ts         # Approved loan, denied loan, new loan account appears
│   │   ├── profile/
│   │   │   └── updateProfile.spec.ts       # Edit address/phone, confirm saved, validation errors
│   │   └── contact/
│   │       └── contact.spec.ts             # Submit contact form, required fields, success message
│   │
│   ├── api/
│   │   ├── auth/
│   │   │   └── login.api.spec.ts           # POST /login 200 valid, 401 bad credentials, 400 empty body
│   │   ├── customers/
│   │   │   └── customers.api.spec.ts       # GET /customers/{id} 200, 404 unknown id, update profile PUT
│   │   ├── accounts/
│   │   │   ├── accounts.api.spec.ts        # GET /accounts/{id} 200/404, POST create checking/savings
│   │   │   └── accountsList.api.spec.ts    # GET /customers/{id}/accounts — list all accounts
│   │   ├── transactions/
│   │   │   ├── transactions.api.spec.ts    # GET /transactions/{id} 200/404
│   │   │   └── transactionSearch.api.spec.ts # GET by date, amount, date range
│   │   ├── transfer/
│   │   │   └── transfer.api.spec.ts        # POST /transfer 200, insufficient funds, invalid account
│   │   ├── billpay/
│   │   │   └── billpay.api.spec.ts         # POST /billpay 200, missing payee fields, bad account
│   │   └── loan/
│   │       └── loan.api.spec.ts            # POST /requestloan approved/denied, missing params
│   │
│   └── hybrid/                             # API Setup + UI Verify
│       ├── openAccountToTransfer.spec.ts   # API: open account → UI: verify balance + transfer funds
│       ├── registerAndLogin.spec.ts        # API: register customer → UI: login + view account overview
│       ├── billPayFlow.spec.ts             # API: create account → UI: pay bill + verify transaction record
│       └── loanToAccount.spec.ts           # API: request loan → UI: verify new loan account in overview
│
├── data/
│   ├── customers.json                      # Test customer credentials (registered users)
│   ├── accounts.json                       # Known account IDs for seeded DB state
│   ├── payees.json                         # Sample bill payee records
│   └── loanScenarios.json                  # Loan amounts and expected approval/denial outcomes
│
├── playwright.config.ts                    # Main Playwright configuration
├── tsconfig.json                           # TypeScript compiler settings
├── package.json                            # Scripts and dependencies
└── .env                                    # Secrets (gitignored)
```

---

## 🏗️ 5. Architecture Deep Dive

### The Fixture Layer — `playwright/fixtures.ts`

The single entry point for all tests. Extends Playwright's `test` to inject `pm` (PageManager) and `am` (ApiManager) into every spec with zero boilerplate.

```typescript
import { test as base, request } from '@playwright/test';
import { PageManager } from '../src/ui/PageManager';
import { ApiManager } from '../src/api/ApiManager';

type CustomFixtures = { pm: PageManager; am: ApiManager };

export const test = base.extend<CustomFixtures>({
  pm: async ({ page }, use) => {
    await use(new PageManager(page));
  },
  am: async ({}, use) => {
    const apiContext = await request.newContext({
      baseURL: process.env.API_BASE_URL,
    });
    await use(new ApiManager(apiContext));
    await apiContext.dispose();
  },
});

export { expect } from '@playwright/test';
```

Every spec file just does:
```typescript
import { test, expect } from '../../playwright/fixtures';
```

### The Manager Pattern — Lazy Loading

Both `PageManager` and `ApiManager` use the `??=` (nullish assignment) pattern. Objects are created **only when first accessed** — a test that only uses `pm.login` never allocates `pm.billPay`, `pm.requestLoan`, etc.

```typescript
// PageManager — only TransferFundsPage is allocated if that's all the test touches
get transferFunds(): TransferFundsPage {
  return (this._transferFunds ??= new TransferFundsPage(this.page));
}
```

### The Base Layer — Shared Discipline

| Class | Responsibility |
|---|---|
| `BasePage` | Wraps every Playwright action with `waitFor({ state: 'visible' })` before interacting |
| `BaseComponent` | Scopes all `locator()` calls to a `root` container — prevents cross-component collisions |
| `BaseController` | Attaches session cookies/auth to every HTTP call; all controllers extend this |

### API Authentication Note

ParaBank uses **form-based session authentication** (not Bearer tokens). The `AuthController` performs a POST login, captures the `JSESSIONID` cookie, and the `BaseController` forwards it on all subsequent requests. The `CookieHelper` utility saves and restores this session state between test steps.

### Data Flow

```
Test Spec
  └─ imports { test, expect } from fixtures.ts
       ├─ pm (PageManager)
       │    └─ pm.transferFunds → TransferFundsPage extends BasePage
       │         └─ TransferFundsLocators (selector constants)
       └─ am (ApiManager)
            └─ am.account → AccountController extends BaseController
                 └─ AccountInterface (TypeScript model)
```

---

## ▶️ 6. Running Tests

### Run all tests

```bash
npx playwright test
```

### Run by layer

```bash
# UI tests only (browser)
npx playwright test --project=UI

# API tests only (no browser)
npx playwright test --project=API

# Hybrid tests
npx playwright test --project=Hybrid
```

### Run a specific spec file

```bash
npx playwright test tests/ui/transactions/transfer.spec.ts
```

### Run by tag or keyword

```bash
npx playwright test --grep "loan"
npx playwright test --grep "@smoke"
```

### Run in headed mode (watch the browser)

```bash
npx playwright test --headed
```

### Debug a single test

```bash
npx playwright test tests/ui/auth/login.spec.ts --debug
```

### Run in UI mode (interactive test explorer)

```bash
npx playwright test --ui
```

---

## 🧪 7. Test Coverage

### UI Test Suites

| Suite | Scenarios |
|---|---|
| **Auth** | Valid login, invalid credentials, empty fields, logout, registration, duplicate username, forgot login lookup |
| **Account Overview** | All accounts listed, balances correct, total computed, account links navigate |
| **Open Account** | Open Checking, open Savings, confirm new account number displayed |
| **Account Details** | Transaction history renders, activity filter by date range |
| **Transfer Funds** | Successful transfer, confirmation message, insufficient funds error, same-account guard |
| **Bill Pay** | Pay to new payee, missing payee fields, invalid account, payment confirmation receipt |
| **Find Transactions** | Search by transaction ID, by date, by date range, by amount, no results state |
| **Request Loan** | Approved loan creates new account, denied loan shows reason, missing fields validation |
| **Update Profile** | Edit name/address/phone, changes persist, required field errors |
| **Contact** | Submit form, required field validation, success confirmation |

### API Test Suites

| Suite | Scenarios |
|---|---|
| **Auth** | POST /login (200 valid, 401 bad credentials, 400 empty) |
| **Customers** | GET /customers/{id} (200/404), PUT update customer info |
| **Accounts** | GET /accounts/{id} (200/404), GET customer account list, POST create account |
| **Transactions** | GET /transactions/{id} (200/404), GET by date, amount, and date range |
| **Transfer** | POST /transfer (200 success, insufficient funds, invalid account IDs) |
| **Bill Pay** | POST /billpay (200 success, missing payee fields, unknown account) |
| **Loan** | POST /requestloan (approved, denied, missing/invalid parameters) |

### Hybrid Test Suites

| Scenario | Strategy |
|---|---|
| **Open Account → Transfer** | API: authenticate + open new account → UI: verify account in overview + complete transfer |
| **Register → Login** | API: register new customer → UI: login + confirm account overview renders |
| **Bill Pay Flow** | API: create funded account → UI: pay bill + verify transaction appears in history |
| **Loan → Account** | API: request and approve loan → UI: verify new loan account visible in overview |

---

## 📊 8. Reporting

### HTML Report (default)

After any test run:

```bash
npx playwright show-report
```

Output saved to `reports/html/`. Includes traces, screenshots, and video on failure.

### Trace Viewer

Traces are captured on first retry. Open a specific trace:

```bash
npx playwright show-trace reports/traces/trace.zip
```

### JUnit (for CI)

JUnit XML is written to `reports/junit/results.xml` on every run — ready for Jenkins, GitHub Actions, or any CI platform that consumes JUnit.

### List Reporter (local dev)

Real-time test pass/fail output in the terminal during local runs.

---

## 🔄 9. CI/CD Integration

### GitHub Actions — `.github/workflows/playwright.yml`

```yaml
name: Playwright Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    timeout-minutes: 30

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Run Playwright tests
        run: npx playwright test
        env:
          BASE_URL: ${{ secrets.BASE_URL }}
          API_BASE_URL: ${{ secrets.API_BASE_URL }}
          TEST_USER_USERNAME: ${{ secrets.TEST_USER_USERNAME }}
          TEST_USER_PASSWORD: ${{ secrets.TEST_USER_PASSWORD }}

      - name: Upload HTML report
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: reports/html/
          retention-days: 14

      - name: Upload JUnit results
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: junit-results
          path: reports/junit/results.xml
```

### CI Execution Strategy

| Setting | Local Dev | CI Pipeline |
|---|---|---|
| `retries` | 0 | 2 |
| `workers` | CPU auto | 4 |
| `reporter` | list + html | html + junit + list |
| `video` | off | retain-on-failure |
| `trace` | off | on-first-retry |

---

## 🗺️ 10. ParaBank URL Reference

| Page | URL | Notes |
|---|---|---|
| Home / Login | `/index.htm` | Customer login panel, news, ATM/Online service info |
| Register | `/register.htm` | New customer registration |
| Account Overview | `/overview.htm` | All accounts and balances (requires login) |
| Open Account | `/openaccount.htm` | Open Checking or Savings account |
| Account Activity | `/activity.htm` | Transactions for a specific account |
| Transfer Funds | `/transfer.htm` | Move money between own accounts |
| Bill Pay | `/billpay.htm` | Pay a bill to a named payee |
| Find Transactions | `/findtrans.htm` | Search by ID, date, amount |
| Request Loan | `/requestloan.htm` | Submit a loan application |
| Update Profile | `/updateprofile.htm` | Edit personal contact info |
| Forgot Login | `/lookup.htm` | Look up username by SSN + name |
| Contact Us | `/contact.htm` | Send a contact enquiry |
| About | `/about.htm` | About ParaBank |
| Admin | `/admin.htm` | Initialize / clean the database |
| Services | `/services.htm` | REST/SOAP/WSDL endpoint directory |
| Site Map | `/sitemap.htm` | Full page index |
| **REST API Base** | `/services/bank` | All REST endpoints (see WADL/OpenAPI) |
| **REST: Accounts** | `/services/bank/accounts/{id}` | GET account detail |
| **REST: Customer Accounts** | `/services/bank/customers/{id}/accounts` | GET list of accounts |
| **REST: Transactions** | `/services/bank/accounts/{id}/transactions` | GET transaction list |
| **REST: Transfer** | `/services/bank/transfer` | POST fund transfer |
| **REST: Bill Pay** | `/services/bank/billpay?accountId={id}` | POST bill payment |
| **REST: Loan** | `/services/bank/requestloan` | POST loan request |
| **REST: Login** | `/services/bank/login/{username}/{password}` | GET customer login |
| **OpenAPI Docs** | `/api-docs/index.html` | Interactive API documentation |

---

## 🤝 11. Contributing

### Branching Strategy

```
main          ← stable, CI-protected
develop       ← integration branch
feature/xxx   ← new pages, controllers, tests
fix/xxx       ← bug fixes
```

### Adding a New Page

1. Create `src/ui/locators/MyPageLocators.ts` with all selectors
2. Create `src/ui/pages/MyPage.ts` extending `BasePage`
3. Add a lazy getter to `src/ui/PageManager.ts`
4. Write specs in `tests/ui/myfeature/myPage.spec.ts`

### Adding a New API Controller

1. Create `src/api/models/MyInterface.ts` with TypeScript types
2. Create `src/api/controllers/MyController.ts` extending `BaseController`
3. Add a lazy getter to `src/api/ApiManager.ts`
4. Write specs in `tests/api/myfeature/my.api.spec.ts`

### Naming Conventions

| Artifact | Convention | Example |
|---|---|---|
| Page class | `PascalCase` + `Page` | `TransferFundsPage` |
| Component class | `PascalCase` + `Component` | `LeftNavComponent` |
| Controller class | `PascalCase` + `Controller` | `LoanController` |
| Locator file | `PascalCase` + `Locators` | `BillPayLocators` |
| Interface file | `PascalCase` + `Interface` | `AccountInterface` |
| Spec file | `camelCase.spec.ts` | `requestLoan.spec.ts` |
| API spec file | `camelCase.api.spec.ts` | `transfer.api.spec.ts` |

---

<div align="center">

Built with ❤️ using [Playwright](https://playwright.dev) · [TypeScript](https://www.typescriptlang.org) · [ParaBank](https://parabank.parasoft.com)

</div>
