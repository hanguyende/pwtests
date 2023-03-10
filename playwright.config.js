// @ts-check
const { defineConfig, devices } = require('@playwright/test');

const config = {
  testDir: './tests',
  retries: 2,
  /* Maximum time one test can run for. */
  timeout: 30 * 1000,
  expect: {
    timeout: 5000
  },
  fullyParallel:true,
  reporter: 'html',
  use: {
    browserName : 'chromium',
    headless: false,
    screenshoot: 'on',
    trace: 'retain-on-failure',
  }
};

module.exports = config

