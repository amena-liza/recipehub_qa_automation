require('../env');
const {specs, suites} = require('./specsAndSuites');
const {browserStackCapabilities, localCapabilities} = require('./capabilities');

let startTime = new Date().toLocaleTimeString('en-US', { hour12: true });
let startDate = new Date().toLocaleTimeString('en-US', { year: 'numeric', month: 'long', day: '2-digit' });

exports.config = {
  user: process.env.BROWSERSTACK_USERNAME || 'BROWSERSTACK_USERNAME',
  key: process.env.BROWSERSTACK_ACCESS_KEY || 'BROWSERSTACK_ACCESS_KEY',

  hostname: 'hub.browserstack.com',

  services: [
    [
      'browserstack',
      {
        accessibility: false,
        buildIdentifier: '${BUILD_NUMBER}',
        browserstackLocal: true,
        opts: { forcelocal: false, localIdentifier: "webdriverio-appium-app-browserstack-repo" },
      }
    ]
  ],

  capabilities: Object.values(browserStackCapabilities),

  commonCapabilities: {
    'bstack:options': {
      projectName: "MyBL QA Automation Project",
      buildName: "MyBL QA Automation Build " + startDate + "",
      sessionName: 'MyBL QA Automation Test With Webdriverio-Appium',
      debug: true,
      networkLogs: true,
      // source: 'webdriverio:appium-sample-sdk:v1.0'
    }
  },

  maxInstances: 10,

  updateJob: false,

  specs: [
    Object.values(specs)
  ],

  suites: suites,

  exclude: [],

  logLevel: 'error',
  coloredLogs: true,
  screenshotPath: './errorShots/',
  baseUrl: '',
  logLevels: {
    webdriver: 'error',
    '@wdio/appium-service': 'error',
  },
  outputDir: './logs',
  bail: 0,
  waitforTimeout: 60000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,

  framework: 'mocha',
  //
  // The number of times to retry the entire specfile when it fails as a whole
  specFileRetries: 2,
  //
  // Delay in seconds between the spec file retry attempts
  specFileRetriesDelay: 0,
  //
  // Whether or not retried spec files should be retried immediately or deferred to the end of the queue
  specFileRetriesDeferred: false,

  mochaOpts: {
    ui: 'bdd',
    timeout: 200000,
  },
  afterSuite: async function (
      test,
      context,
      { error, result, duration, passed, retries }
  ) {
    if (error) {
      await browser.takeScreenshot();
    }
  }
};

// Code to support common capabilities
exports.config.capabilities.forEach(function(caps){
  for(let key in exports.config.commonCapabilities)
    caps[key] = { ...caps[key], ...exports.config.commonCapabilities[key]};
});
