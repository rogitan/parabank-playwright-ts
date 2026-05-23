# ParaBank Automation Framework — AI Context Reference

## Overview

Playwright + TypeScript E2E test automation framework for the ParaBank demo banking app. Uses Page Object Model with custom fixtures, API controllers, and hybrid (API+UI) tests.

- **Base URL:** `https://parabank.parasoft.com/parabank`
- **API Base:** `/parabank/services/bank`
- **Auth:** Form-based session auth (`JSESSIONID` cookie)

---

## Project Structure

```
├── playwright/               # Custom fixtures ({ pm, am } injection)
├── src/
│   ├── base/                 # BasePage, BaseComponent, BaseController
│   ├── ui/                   # PageManager, pages/, components/, locators/
│   ├── api/                  # ApiManager, controllers/, models/
│   └── utils/                # Logger, DataGenerator, CookieHelper, DbResetHelper
├── tests/
│   ├── ui/                   # Browser tests (auth/, accounts/, transactions/, loan/, profile/, contact/)
│   ├── api/                  # API contract tests (auth/, customers/, accounts/, etc.)
│   └── hybrid/               # API setup + UI verify tests
├── data/                     # JSON test data (customers, accounts, payees, loan scenarios)
├── reports/                  # html/, junit/, traces/
├── .env                      # Secrets (gitignored)
├── playwright.config.ts
├── tsconfig.json
└── package.json
```

---

## Architecture Rules

### 1. Fixture Pattern
- `playwright/fixtures.ts` extends `test` with `pm` (PageManager) and `am` (ApiManager)
- Specs import: `import { test, expect } from '../../playwright/fixtures'`

### 2. Page Object Model
- Pages extend `BasePage` — all actions go through `BasePage` wrappers (click, fill, navigate, etc.)
- Components extend `BaseComponent` — locators scoped to a `root` element
- Selectors live in `/locators` files only (never hardcoded in pages)
- Page manager uses `??=` lazy-loading pattern

### 3. API Layer
- Controllers extend `BaseController` — auto-attaches session cookies
- Models are TypeScript interfaces (not classes)
- ApiManager lazy-loads controllers with `??=`

### 4. Naming Conventions

| Artifact | Convention | Example |
|---|---|---|
| Page class | PascalCase + `Page` | `TransferFundsPage` |
| Component | PascalCase + `Component` | `LeftNavComponent` |
| Controller | PascalCase + `Controller` | `LoanController` |
| Locators | PascalCase + `Locators` | `BillPayLocators` |
| Interface | PascalCase + `Interface` | `AccountInterface` |
| UI spec | `camelCase.spec.ts` | `requestLoan.spec.ts` |
| API spec | `camelCase.api.spec.ts` | `transfer.api.spec.ts` |

### 5. Test Layer Strategies

| Layer | Strategy |
|---|---|
| UI | Full browser flow, web-first assertions |
| API | Direct REST calls, no browser |
| Hybrid | API for preconditions, UI for visual verification |

### 6. Test Commands
- All: `npx playwright test`
- By layer: `--project=UI | API | Hybrid`
- By tag: `--grep "@smoke"`
- Debug: `--debug`
- Report: `npx playwright show-report`

---

## Key Files to Know

| File | Purpose |
|---|---|
| `playwright/fixtures.ts` | Custom fixture defining `pm` and `am` |
| `src/base/BasePage.ts` | Global UI action wrappers with web-first assertions |
| `src/base/BaseComponent.ts` | Scoped root-locator component |
| `src/base/BaseController.ts` | Global API wrappers with session forwarding |
| `src/ui/PageManager.ts` | Lazy-loaded UI page hub |
| `src/api/ApiManager.ts` | Lazy-loaded API controller hub |
| `src/utils/DataGenerator.ts` | Faker-based test data generation |
| `playwright.config.ts` | Multi-project config (UI, API, Hybrid, smoke, regression) |
