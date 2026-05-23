# Quick Prompt Reference Card

```
CONTEXT:
- Rules: .mdFiles/INSTRUCTION_COMPACT.md
- Reference: tests/fileNte.spec.ts

INPUT:
.mdFiles/test_steps.md

TASK:
1. Locators → main/locators/ (reuse existing if available)
2. Actions → main/functions/ (extend @BasePage)
3. Test specs → tests/fileNte.spec.ts
4. Proper waits for loading spinners/images
5. Strict TypeScript, no any types
6. Do not overwrite existing test.spec file

OUTPUT:
Complete test file ready to run
```

## After Generation

```
Run: @playwright-test-healer
Fix: Broken selectors
Done: Commit & merge
```
