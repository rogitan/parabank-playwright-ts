import { defineConfig } from "allure";

export default defineConfig({
  name: "ParaBank Test Automation Report",
  output: "./allure-report",
  historyPath: "./allure-history.jsonl",
  plugins: {
    awesome: {
      options: {
        reportName: "ParaBank Test Automation",
        singleFile: false,
        reportLanguage: "en",
      },
    },
    log: {
      options: {
        groupBy: "none",
      },
    },
  },
  qualityGate: {
    rules: [
      {
        maxFailures: 5,
        maxBroken: 5,
        maxSkipped: 10,
        fastFail: true,
      },
    ],
  },
  categories: {
    rules: [
      {
        name: "Sauce Labs errors",
        matchers: {
          message: /sauce labs|saucelabs/i,
          statuses: ["failed", "broken"],
        },
      },
      {
        name: "Timeout errors",
        matchers: {
          message: /timeout|timed out/i,
          statuses: ["failed", "broken"],
        },
      },
    ],
  },
});
