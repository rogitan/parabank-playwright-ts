const fs = require('fs');
const path = require('path');

const resultsDir = path.join(__dirname, '..', '..', 'junit-results');
const outputFile = path.join(__dirname, '..', '..', 'report-body.html');

function parseJUnit(filePath) {
  const xml = fs.readFileSync(filePath, 'utf8');
  const total = parseInt(xml.match(/tests="(\d+)"/)?.[1] || 0);
  const failed = parseInt(xml.match(/failures="(\d+)"/)?.[1] || 0);
  const skipped = parseInt(xml.match(/skipped="(\d+)"/)?.[1] || 0);
  const passed = total - failed - skipped;

  const testCases = [];
  const testCaseRegex = /<testcase[\s\S]*?<\/testcase>/g;
  let match;
  while ((match = testCaseRegex.exec(xml)) !== null) {
    const name = match[0].match(/name="([^"]+)"/)?.[1] || 'unknown';
    const hasFailure = /<failure/.test(match[0]);
    const hasError = /<error/.test(match[0]);
    if (hasFailure || hasError) {
      const message = match[0].match(/message="([^"]+)"/)?.[1] || 'No details';
      testCases.push({ name, status: 'FAILED', message });
    } else {
      testCases.push({ name, status: 'PASSED', message: '' });
    }
  }

  return { total, passed, failed, skipped, testCases };
}

function generateReport() {
  const files = fs.readdirSync(resultsDir).filter(f => f.endsWith('.xml'));
  let totals = { total: 0, passed: 0, failed: 0, skipped: 0 };
  const allFailedTests = [];

  for (const file of files) {
    const result = parseJUnit(path.join(resultsDir, file));
    totals.total += result.total;
    totals.passed += result.passed;
    totals.failed += result.failed;
    totals.skipped += result.skipped;
    allFailedTests.push(...result.testCases.filter(t => t.status === 'FAILED'));
  }

  const runUrl = `https://github.com/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`;
  const status = totals.failed > 0 ? '❌ FAILED' : '✅ PASSED';

  let failedTestsHtml = '';
  if (allFailedTests.length > 0) {
    failedTestsHtml = `
      <h3 style="color:#dc3545;">Failed Tests (${allFailedTests.length})</h3>
      <table style="border-collapse:collapse;width:100%;">
        <tr style="background:#f8d7da;">
          <th style="padding:8px;border:1px solid #ddd;text-align:left;">Test</th>
          <th style="padding:8px;border:1px solid #ddd;text-align:left;">Error</th>
        </tr>
        ${allFailedTests.map(t => `
          <tr>
            <td style="padding:8px;border:1px solid #ddd;">${escapeHtml(t.name)}</td>
            <td style="padding:8px;border:1px solid #ddd;color:#dc3545;font-size:13px;">${escapeHtml(t.message)}</td>
          </tr>
        `).join('')}
      </table>`;
  }

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px; color: #333; }
    h1 { font-size: 22px; margin-bottom: 8px; }
    .summary { display: flex; gap: 16px; margin: 16px 0; }
    .stat { padding: 12px 20px; border-radius: 6px; font-size: 18px; font-weight: 600; }
    .stat.total { background: #e9ecef; }
    .stat.passed { background: #d4edda; color: #155724; }
    .stat.failed { background: #f8d7da; color: #721c24; }
    .stat.skipped { background: #fff3cd; color: #856404; }
    a { color: #007bff; }
    .footer { margin-top: 24px; font-size: 13px; color: #6c757d; }
  </style>
</head>
<body>
  <h1>${status} — Parabank Test Report</h1>
  <p>
    <a href="${runUrl}" style="font-size:14px;">View full run on GitHub →</a>
  </p>

  <div class="summary">
    <div class="stat total">Total: ${totals.total}</div>
    <div class="stat passed">Passed: ${totals.passed}</div>
    <div class="stat failed">Failed: ${totals.failed}</div>
    <div class="stat skipped">Skipped: ${totals.skipped}</div>
  </div>

  <p><strong>Retries:</strong> Up to 2 retries per test on CI.</p>

  ${failedTestsHtml}

  <div class="footer">
    <p>
      📎 <strong>Artifacts (downloadable from run page above):</strong><br>
      • HTML report — Full test report with detailed results<br>
      • Screenshots & traces — Captured for failed tests<br>
      • Allure results — For Allure report generation<br>
    </p>
    <p>Triggered by: ${process.env.GITHUB_ACTOR || 'unknown'} &nbsp;|&nbsp; Branch: ${process.env.GITHUB_REF_NAME || 'unknown'}</p>
  </div>
</body>
</html>`;

  fs.writeFileSync(outputFile, html);
  console.log(`Status: ${status}`);
  console.log(`Total: ${totals.total}, Passed: ${totals.passed}, Failed: ${totals.failed}, Skipped: ${totals.skipped}`);

  const output = process.env.GITHUB_OUTPUT;
  if (output) {
    fs.appendFileSync(output, `status=${status}\n`);
    fs.appendFileSync(output, `total=${totals.total}\n`);
    fs.appendFileSync(output, `passed=${totals.passed}\n`);
    fs.appendFileSync(output, `failed=${totals.failed}\n`);
    fs.appendFileSync(output, `skipped=${totals.skipped}\n`);
  }
}

function escapeHtml(text) {
  if (!text) return '';
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

generateReport();
