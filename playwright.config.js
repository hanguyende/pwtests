// @ts-check
const { defineConfig, devices } = require('@playwright/test');

const config = {
  testDir: './tests',
  /* Maximum time one test can run for. */
  timeout: 30 * 1000,
  expect: {
    timeout: 5000
  },
  reporter: 'html',
  use: {
    browserName : 'webkit',
    headless: true,
    screenshoot: 'on',
    trace: 'retain-on-failure',
  }
};

module.exports = config

