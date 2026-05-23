import * as path from 'node:path';

function getCallerInfo(): string {
  const stack = new Error().stack?.split('\n');
  if (!stack) return '';
  const callerLine = stack.find(line => {
    const file = line.match(/\((.*?)\)/)?.[1] || line.match(/at\s+(.*)/)?.[1];
    return file && !file.includes('Logger') && !file.includes('node:');
  });
  if (!callerLine) return '';
  const raw = callerLine.match(/\((.*?)\)/)?.[1] || callerLine.match(/at\s+(.*)/)?.[1];
  if (!raw) return '';
  const match = raw.match(/(.*):(\d+):\d+$/);
  if (!match) return '';
  const fullPath = match[1].trim();
  const lineNum = match[2];
  const projectRoot = process.cwd();
  const relativePath = path.relative(projectRoot, fullPath);
  return `${relativePath}:${lineNum}`;
}

export class Logger {
  static actionLog(message: string): void {
    const caller = getCallerInfo();
    console.log(`\n${caller} *** ${message} ***`);
  }

  static resultLog(message: string): void {
    const caller = getCallerInfo();
    console.log(`\n${caller} === ${message} ===`);
  }
}
