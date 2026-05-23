---
name: test-script-generate
description: Generate Playwright E2E test scripts from test_steps.md. Triggers when user says "generate test", "test script generate", "write test script", or "run e2e prompt".
---

# Test Script Generation

## Context
- Rules: `.mdFiles/INSTRUCTION_COMPACT.md`

## Input
`.mdFiles/test_steps.md`

## Task
1. Locators → `main/locators/` (reuse existing if available)
2. Actions → `main/page/` (extend `@BasePage`)
3. Test specs → `tests/` (do not overwrite existing spec files)
4. Proper waits for loading spinners/images
5. Strict TypeScript, no `any` types

## Output
Complete test file ready to run

## After Generation
- Run: `@playwright-test-healer`
- Fix: Broken selectors
- Done: Commit & merge