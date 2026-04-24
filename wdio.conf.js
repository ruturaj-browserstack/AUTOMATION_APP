export const config = {
  runner: 'local',
  specs: ['./test/specs/**/*.spec.js'],
  suites: {
    smoke: [
      './test/specs/login.spec.js',
      './test/specs/todo.spec.js',
    ],
    regression: [
      './test/specs/login.spec.js',
      './test/specs/todo.spec.js',
      './test/specs/counter.spec.js',
    ],
  },
  maxInstances: 1,
  capabilities: [
    {
      browserName: 'chrome',
      'goog:chromeOptions': {
        args: [
          '--headless=new',
          '--no-sandbox',
          '--disable-gpu',
          '--disable-dev-shm-usage',
          '--window-size=1280,800',
        ],
      },
    },
  ],
  logLevel: 'warn',
  bail: 0,
  baseUrl: process.env.BASE_URL || 'http://localhost:5173',
  apiUrl: process.env.API_URL || 'http://localhost:8000',
  waitforTimeout: 10_000,
  connectionRetryTimeout: 120_000,
  connectionRetryCount: 3,
  services: [],
  framework: 'mocha',
  reporters: ['spec'],
  mochaOpts: {
    ui: 'bdd',
    timeout: 60_000,
  },
};
