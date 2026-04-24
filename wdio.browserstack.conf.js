import dotenv from 'dotenv';
dotenv.config({ override: true });
import { config as base } from './wdio.conf.js';

const required = (name) => {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name} (see .env.example)`);
  return v;
};

const user = required('BROWSERSTACK_USERNAME');
const key = required('BROWSERSTACK_ACCESS_KEY');
const hubHost = process.env.BROWSERSTACK_HUB_HOST || 'hub-preprod.bsstag.com';
const hubPort = Number(process.env.BROWSERSTACK_HUB_PORT || 443);
const hubPath = process.env.BROWSERSTACK_HUB_PATH || '/wd/hub';
const useLocal = String(process.env.BROWSERSTACK_LOCAL || 'true').toLowerCase() === 'true';
const buildName = process.env.BUILD_NAME || `local-${new Date().toISOString().slice(0, 16)}`;
const buildIdentifier = process.env.BUILD_NUMBER || String(Date.now());

export const config = {
  ...base,
  user,
  key,
  hostname: hubHost,
  port: hubPort,
  path: hubPath,
  protocol: 'https',

  services: [
    [
      'browserstack',
      {
        browserstackLocal: useLocal,
        opts: { forcelocal: false },
        testObservability: false,
      },
    ],
  ],

  capabilities: [
    {
      browserName: 'Chrome',
      'goog:chromeOptions': {
        args: ['--user-agent=WdioRegression/1.0 ngrok-skip'],
      },
      'bstack:options': {
        browserVersion: 'latest',
        os: 'OS X',
        osVersion: 'Sonoma',
      },
    },
    {
      browserName: 'Chrome',
      'goog:chromeOptions': {
        args: ['--user-agent=WdioRegression/1.0 ngrok-skip'],
      },
      'bstack:options': {
        browserVersion: '120.0',
        os: 'Windows',
        osVersion: '11',
      },
    },
  ],

  commonCapabilities: {
    'bstack:options': {
      projectName: 'Product Automation',
      buildName,
      sessionName: 'WDIO Regression',
      buildIdentifier,
      consoleLogs: 'info',
      networkLogs: true,
      seleniumVersion: '4.22.0',
    },
  },

  maxInstances: 1,
  waitforTimeout: 30_000,
  logLevel: 'warn',
};

config.capabilities.forEach((caps) => {
  for (const i in config.commonCapabilities) {
    caps[i] = { ...caps[i], ...config.commonCapabilities[i] };
  }
});
