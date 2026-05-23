const fs = require('fs');
const path = require('path');

const resultsDir = path.join(__dirname, '..', '..', 'allure-results');
const outputFile = path.join(__dirname, '..', '..', 'test-summary.json');

if (!fs.existsSync(resultsDir)) {
  fs.writeFileSync(outputFile, JSON.stringify({ total: 0, passed: 0, failed: 0, skipped: 0, broken: 0, failedTests: [] }));
  process.exit(0);
}

const files = fs.readdirSync(resultsDir).filter(f => f.endsWith('-result.json'));
const summary = { total: 0, passed: 0, failed: 0, skipped: 0, broken: 0, failedTests: [] };

for (const file of files) {
  const data = JSON.parse(fs.readFileSync(path.join(resultsDir, file), 'utf8'));
  const status = data.status || 'unknown';
  summary.total++;
  if (status === 'passed') summary.passed++;
  else if (status === 'failed') {
    summary.failed++;
    summary.failedTests.push({
      name: data.name || 'unknown',
      message: data.statusDetails?.message || 'No details',
    });
  } else if (status === 'skipped') summary.skipped++;
  else if (status === 'broken') summary.broken++;
}

fs.writeFileSync(outputFile, JSON.stringify(summary, null, 2));
