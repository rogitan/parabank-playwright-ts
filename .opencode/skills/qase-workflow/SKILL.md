---
name: qase-workflow
description: Fetch test cases from Qase MCP and write formatted test steps to .mdFiles/test_steps.md. Triggers on commands like "get test step", "get in qase test step for <PROJECT_ID>-<CASE_NUMBER>", "get in qase", or "get in qase and write test".
compatibility: opencode
---

## Qase Test Steps Workflow

### Fetch & Save
**Triggers (any of the following):**
- `test step <PROJECT_ID>-<CASE_NUMBER>`
- `get test step <PROJECT_ID>-<CASE_NUMBER>`
- `get in qase test step for <PROJECT_ID>-<CASE_NUMBER>`
- `get in qase test step <PROJECT_ID>-<CASE_NUMBER>`

**Steps:**
1. Fetch the test case from Qase using qase-mcp
2. Ask the user: "I found the test case. Do you want to overwrite `.mdFiles/test_steps.md`?"
3. If **yes** → overwrite `.mdFiles/test_steps.md` with the formatted output below
4. If **no** → display the fetched test steps in chat only, do not write to file

---

### Use in Qase (context only)
**Trigger:** `get in qase` — only when NO case number or "test step" is mentioned

**Steps:**
1. Read `.mdFiles/test_steps.md`
2. Use the stored content as context/input for the next Qase action

---

### Write Test from Qase
**Triggers (any of the following):**
- `get in qase and write test`
- `write and get test in qase`

**Steps:**
1. Read `.mdFiles/test_steps.md`
2. Use stored content as context
3. Generate the Playwright test following rules in `playwright-instructions` skill

---

### Output Format (`.mdFiles/test_steps.md`)

# Test Suite: <Identified Feature/Suite Name>

**Qase ID:** <CASE_NUMBER>
**Test File:** <relevant spec file if identifiable>
**Precondition:** <precondition from Qase if any>

## Test Title
<Test case title from Qase>

## Test Steps

1. <Step 1 action>
2. <Step 2 action>
...

## Related Files
- Reference test: ``
- Locators: ``
- Functions: ``
- User roles: `.mdFiles/user roles.txt`