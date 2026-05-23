const fs = require('fs');
const path = require('path');

const summariesDir = path.join(__dirname, '..', '..', 'summaries');
const outputFile = path.join(__dirname, '..', '..', 'test-summary.json');

const merged = { total: 0, passed: 0, failed: 0, skipped: 0, broken: 0, failedTests: [] };

if (!fs.existsSync(summariesDir)) {
  fs.writeFileSync(outputFile, JSON.stringify(merged));
  process.exit(0);
}

const files = fs.readdirSync(summariesDir).filter(f => f.endsWith('.json'));

for (const file of files) {
  const data = JSON.parse(fs.readFileSync(path.join(summariesDir, file), 'utf8'));
  merged.total += data.total || 0;
  merged.passed += data.passed || 0;
  merged.failed += data.failed || 0;
  merged.skipped += data.skipped || 0;
  merged.broken += data.broken || 0;
  if (data.failedTests) {
    merged.failedTests.push(...data.failedTests);
  }
}

fs.writeFileSync(outputFile, JSON.stringify(merged, null, 2));
console.log(`Merged: Total=${merged.total}, Passed=${merged.passed}, Failed=${merged.failed}`);
