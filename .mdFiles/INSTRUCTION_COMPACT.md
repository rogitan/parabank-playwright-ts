# Playwright Test Generation (Compact Reference)

## Tools
- **Browser Automation**: `playwright-cli` — run in `--headed` mode
- **MCP Integration**: `playwright-mcp` — use for inspection, element discovery, and live browser interaction during test generation

## Core Rules
- **POM Architecture**: Locators → `src/ui/locators/`, Actions → `src/ui/pages`
- **Locators**: Use Playwright built-ins (`getByRole`, `getByTestId`, `getByText`); store in dedicated classes
- **Actions**: Extend `@BasePage`; wrap locators with reusable methods
- **Reuse Before Create**: Check existing classes in `src/ui/locators/` and `src/ui/pages` first
- **Typing**: Strict TypeScript; no `any` types
- **Waits**: Implement proper loading waits before assertions
- **Assertions**: Keep all `expect()` assertions at the spec/test level only — never inside page methods
- **Method Granularity**: Never create a page method that wraps only a single action; every method must compose two or more actions (e.g. fill + click, click + wait, select + fill + submit)


1. Import locators & page classes
2. Use `test.describe()` + `test()` + `test.beforeEach()` hooks
3. No hardcoded values — use variables/fixtures/env vars
4. Implement wait-until patterns for spinners/images

## Agent Directives
- **planner**: Review core rules → strategize coverage; use `playwright-mcp` to inspect UI if needed
- **generator**: Follow POM rules + reuse existing classes; use `playwright-cli --headed` to validate selectors live; use `playwright-mcp` for element discovery
- **healer**: Fix broken tests by updating `main/` classes (NOT inline specs); use `playwright-cli` to reproduce failures


## Quick Reference
- **Live selector check**: Run via `playwright-cli --headed` before committing locators
- **Element inspection**: Use `playwright-mcp` snapshot or click tools to discover selectors when unsure