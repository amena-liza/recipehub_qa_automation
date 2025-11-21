require('../env');
const {specs, suites} = require('./specsAndSuites');
const {localCapabilities} = require("./capabilities");

let appiumProcess;
exports.config = {

  onPrepare: function (config, localCapabilities) {
    console.log('\n🚀 Starting Appium server locally...');
    global.appiumProcess = startAppiumServer();
  },

  // ✅ Add test hooks here!
  beforeSuite: function (suite) {
    // appiumProcess = startAppiumServer();
    console.log(`\n📌 Starting Suite: ${suite.title}`);
  },

  beforeTest: function (test) {
    console.log(`\n🚀 Executing: ${test.title}`);
  },

  afterTest: async function (test, context, { error, result, duration, passed, retries }) {
    let status;
    if (passed) {
      status = '✅ PASSED';
    } else if (retries.attempts < retries.limit) {
      status = `🔄 RETRYING (${retries.attempts + 1}/${retries.limit})`;
    } else {
      status = '❌ FAILED';
      const name = 'ERROR-' + Date.now();
      await driver.takeScreenshot();
    }

    console.log(`${status}: ${test.title}`);

    // Store test results in an array
    if (!global.testResults) global.testResults = [];
    global.testResults.push({
      test: test.title,
      status,
      attempts: retries.attempts,
      maxRetries: retries.limit,
    });
  },

  after: function () {
    console.log('\n📌 Test Execution Summary:');
    console.table(global.testResults || []);
  },

  runner: 'local',

  port: 4723,

  specs: Object.values(specs),

  suites: suites,

  exclude: [],

  maxInstances: 1,

  capabilities: Object.values(localCapabilities),

  logLevel: 'error',

  logLevels: {
    webdriver: 'error',
    '@wdio/appium-service': 'error',
  },
  outputDir: './logs',

  bail: 0,
  // Default timeout for all waitFor* commands.
  waitforTimeout: 60000,
  // Default timeout in milliseconds for request
  // if browser driver or grid doesn't send response
  connectionRetryTimeout: 120000,
  // Default request retries count
  connectionRetryCount: 3,
  // Test runner services
  // Services take over a specific job you don't want to take care of. They enhance
  // your test setup with almost no effort. Unlike plugins, they don't add new
  // commands. Instead, they hook themselves up into the test process.
  services: [
    [
      'appium',
      {
        waitStartTime: '10000',
        args: {
          address: '127.0.0.1',
          port: 4723,
        },
        command: 'appium',
      },
    ],
  ],

  // Framework you want to run your specs with.
  // The following are supported: Mocha, Jasmine, and Cucumber
  // see also: https://webdriver.io/docs/frameworks
  //
  // Make sure you have the wdio adapter package for the specific framework installed
  // before running any tests.
  framework: 'mocha',
  //
  // The number of times to retry the entire specfile when it fails as a whole
  specFileRetries: 0,
  //
  // Delay in seconds between the spec file retry attempts
  specFileRetriesDelay: 0,
  //
  // Whether or not retried spec files should be retried immediately or deferred to the end of the queue
  specFileRetriesDeferred: false,
  //
  // Test reporter for stdout.
  // The only one supported by default is 'dot'
  // see also: https://webdriver.io/docs/dot-reporter
  // reporters: ['spec'],
  reporters: [
    'spec',
    [
      'allure',
      {
        outputDir: 'allure-results',
        disableWebdriverStepsReporting: false,
        disableWebdriverScreenshotsReporting: false,
      },
    ],
  ],

  //
  // Options to be passed to Mocha.
  // See the full list at http://mochajs.org/
  mochaOpts: {
    ui: 'bdd',
    timeout: 200000,
  },
  //
  // =====
  // Hooks
  // =====
  // WebdriverIO provides several hooks you can use to interfere with the test process in order to enhance
  // it and to build services around it. You can either apply a single function or an array of
  // methods to it. If one of them returns with a promise, WebdriverIO will wait until that promise got
  // resolved to continue.
  /**
   * Gets executed once before all workers get launched.
   * @param {object} config wdio configuration object
   * @param {Array.<Object>} capabilities list of capabilities details
   */

  /**
   * Gets executed before a worker process is spawned and can be used to initialise specific service
   * for that worker as well as modify runtime environments in an async fashion.
   * @param  {string} cid      capability id (e.g 0-0)
   * @param  {object} caps     object containing capabilities for session that will be spawn in the worker
   * @param  {object} specs    specs to be run in the worker process
   * @param  {object} args     object that will be merged with the main configuration once worker is initialized
   * @param  {object} execArgv list of string arguments passed to the worker process
   */
  // onWorkerStart: function (cid, caps, specs, args, execArgv) {
  // },
  /**
   * Gets executed just after a worker process has exited.
   * @param  {string} cid      capability id (e.g 0-0)
   * @param  {number} exitCode 0 - success, 1 - fail
   * @param  {object} specs    specs to be run in the worker process
   * @param  {number} retries  number of retries used
   */
  // onWorkerEnd: function (cid, exitCode, specs, retries) {
  // },
  /**
   * Gets executed just before initialising the webdriver session and test framework. It allows you
   * to manipulate configurations depending on the capability or spec.
   * @param {object} config wdio configuration object
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {Array.<String>} specs List of spec file paths that are to be run
   * @param {string} cid worker id (e.g. 0-0)
   */
  // beforeSession: function (config, capabilities, specs, cid) {
  // },
  /**
   * Gets executed before test execution begins. At this point you can access to all global
   * variables like `browser`. It is the perfect place to define custom commands.
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {Array.<String>} specs        List of spec file paths that are to be run
   * @param {object}         browser      instance of created browser/device session
   */
  // before: function (capabilities, specs) {
  // },
  /**
   * Runs before a WebdriverIO command gets executed.
   * @param {string} commandName hook command name
   * @param {Array} args arguments that command would receive
   */
  // beforeCommand: function (commandName, args) {
  // },
  /**
   * Function to be executed before a test (in Mocha/Jasmine) starts.
   */
  // beforeTest: function (test, context) {
  // },
  /**
   * Hook that gets executed _before_ a hook within the suite starts (e.g. runs before calling
   * beforeEach in Mocha)
   */
  // beforeHook: function (test, context) {
  // },
  /**
   * Hook that gets executed _after_ a hook within the suite starts (e.g. runs after calling
   * afterEach in Mocha)
   */

  // afterHook: function (test, context, { error, result, duration, passed, retries }) {
  // },
  /**
   * Function to be executed after a test (in Mocha/Jasmine only)
   * @param {object}  test             test object
   * @param {object}  context          scope object the test was executed with
   * @param {Error}   result.error     error object in case the test fails, otherwise `undefined`
   * @param {*}       result.result    return object of test function
   * @param {number}  result.duration  duration of test
   * @param {boolean} result.passed    true if test has passed, otherwise false
   * @param {object}  result.retries   informations to spec related retries, e.g. `{ attempts: 0, limit: 0 }`
   */
  afterSuite: async function (
      test,
      context,
      { error, result, duration, passed, retries }
  ) {
    if (error) {
      await browser.takeScreenshot();
    }
  },

  //run appium from command line
  //appium server --address localhost --port  4723 --use-drivers uiautomator2 --base-path /wd/hub

  /**
   * Hook that gets executed after the suite has ended
   * @param {object} suite suite details
   */
  // afterSuite: function (suite) {
  // },
  /**
   * Runs after a WebdriverIO command gets executed
   * @param {string} commandName hook command name
   * @param {Array} args arguments that command would receive
   * @param {number} result 0 - command success, 1 - command error
   * @param {object} error error object if any
   */
  // afterCommand: function (commandName, args, result, error) {
  // },
  /**
   * Gets executed after all tests are done. You still have access to all global variables from
   * the test.
   * @param {number} result 0 - test pass, 1 - test fail
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {Array.<String>} specs List of spec file paths that ran
   */
  // after: function (result, capabilities, specs) {
  // },
  /**
   * Gets executed right after terminating the webdriver session.
   * @param {object} config wdio configuration object
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {Array.<String>} specs List of spec file paths that ran
   */
  // afterSession: async function (config, capabilities, specs) {
  //     await client.deleteSession();
  // },
  /**
   * Gets executed after all workers got shut down and the process is about to exit. An error
   * thrown in the onComplete hook will result in the test run failing.
   * @param {object} exitCode 0 - success, 1 - fail
   * @param {object} config wdio configuration object
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {<Object>} results object containing test results
   */

  /**
   * Gets executed when a refresh happens.
   * @param {string} oldSessionId session ID of the old session
   * @param {string} newSessionId session ID of the new session
   */
};

function startAppiumServer() {
  if (appiumProcess) {
    console.log('Stopping Appium server...');
    appiumProcess.kill('SIGINT');
  }

  console.log('Starting Appium server...');
  const appiumArgs = [
    '--address',
    '127.0.0.1',
    '--port',
    '4723',
    '--no-reset',
    // Add other Appium server options as needed
  ];

  const process = exec(
      `appium ${appiumArgs.join(' ')}`,
      (error, stdout, stderr) => {
        if (error) {
          console.error(`Error starting Appium server: ${stderr}`);
        } else {
          console.log(`Appium server started: ${stdout}`);
        }
      }
  );

  return process;
}