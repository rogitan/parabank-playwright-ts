---
name: playwright-instructions
description: Playwright test generation rules using POM architecture, playwright-cli and playwright-mcp. Use when writing, fixing, or generating Playwright tests.
---

# Playwright Test Generation (Compact Reference)

## Tools
- **Browser Automation**: `playwright-cli` — run in `--headed` mode
- **MCP Integration**: `playwright-mcp` — use for inspection, element discovery, and live browser interaction during test generation

## Core Rules
- **POM Architecture**: Locators → `main/locators/`, Actions → `main/functions/`
- **Locators**: Use Playwright built-ins (`getByRole`, `getByTestId`, `getByText`); store in dedicated classes
- **Actions**: Extend `@BasePage`; wrap locators with reusable methods
- **Reuse Before Create**: Check existing classes in `main/locators/` and `main/functions/` first
- **Typing**: Strict TypeScript; no `any` types
- **Waits**: Implement proper loading waits before assertions

## OOP Principles (apply strictly)
- **Encapsulation**: Never access locators directly in test specs — always go through a function/method in `main/functions/`
- **Single Responsibility**: Each class owns one page or component; one method does one thing
- **Inheritance**: All page classes extend `@BasePage`; never duplicate base methods
- **DRY**: If the same action appears more than once, extract it into a reusable method in `main/functions/`
- **Meaningful naming**: Methods should read like sentences — `searchByOffender()`, `clickFirstNteLink()`, `validateRowValues()` not `doAction()` or `click1()`
- **No logic in specs**: Test files should only call methods — no raw `page.click()`, no inline locators, no conditional logic inside `test()` blocks

## What Clean Tests Look Like
```ts