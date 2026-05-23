const fs = require('fs');
const path = require('path');

const summaryFile = path.join(__dirname, '..', '..', 'test-summary.json');
const outputFile = path.join(__dirname, '..', '..', 'report-body.html');

function generateReport() {
  if (!fs.existsSync(summaryFile)) {
    console.error('test-summary.json not found');
    process.exit(1);
  }

  const result = JSON.parse(fs.readFileSync(summaryFile, 'utf8'));

  const runUrl = `https://github.com/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`;
  const status = result.failed > 0 || result.broken > 0 ? '❌ FAILED' : '✅ PASSED';

  let failedTestsHtml = '';
  if (result.failedTests?.length > 0) {
    failedTestsHtml = `
      <h3 style="color:#dc3545;">Failed Tests (${result.failedTests.length})</h3>
      <table style="border-collapse:collapse;width:100%;">
        <tr style="background:#f8d7da;">
          <th style="padding:8px;border:1px solid #ddd;text-align:left;">Test</th>
          <th style="padding:8px;border:1px solid #ddd;text-align:left;">Error</th>
        </tr>
        ${result.failedTests.map(t => `
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
    .stat.broken { background: #f8d7da; color: #721c24; }
    .stat.skipped { background: #fff3cd; color: #856404; }
    a { color: #007bff; }
    .footer { margin-top: 24px; font-size: 13px; color: #6c757d; }
  </style>
</head>
<body>
  <h1>${status} — Parabank E2E Test Report</h1>
  <p>
    <a href="${runUrl}" style="font-size:14px;">View full run on GitHub →</a>
  </p>

  <div class="summary">
    <div class="stat total">Total: ${result.total}</div>
    <div class="stat passed">Passed: ${result.passed}</div>
    <div class="stat failed">Failed: ${result.failed}</div>
    <div class="stat broken">Broken: ${result.broken}</div>
    <div class="stat skipped">Skipped: ${result.skipped}</div>
  </div>

  <p><strong>Retries:</strong> Up to 2 retries per test on CI.</p>

  ${failedTestsHtml}

  <div class="footer">
    <p>
      📎 <strong>HTML Report:</strong> Download from the run page artifacts section above.<br>
    </p>
    <p>Triggered by: ${process.env.GITHUB_ACTOR || 'unknown'} &nbsp;|&nbsp; Branch: ${process.env.GITHUB_REF_NAME || 'unknown'}</p>
  </div>
</body>
</html>`;

  fs.writeFileSync(outputFile, html);
  console.log(`Status: ${status}`);
  console.log(`Total: ${result.total}, Passed: ${result.passed}, Failed: ${result.failed}, Broken: ${result.broken}, Skipped: ${result.skipped}`);

  const output = process.env.GITHUB_OUTPUT;
  if (output) {
    fs.appendFileSync(output, `status=${status}\n`);
    fs.appendFileSync(output, `total=${result.total}\n`);
    fs.appendFileSync(output, `passed=${result.passed}\n`);
    fs.appendFileSync(output, `failed=${result.failed}\n`);
    fs.appendFileSync(output, `skipped=${result.skipped}\n`);
  }
}

function escapeHtml(text) {
  if (!text) return '';
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

generateReport();
