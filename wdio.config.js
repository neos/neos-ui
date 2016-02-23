const utils = require('./Build/Utilities/');
const selectors = require('./Resources/Private/JavaScript/Shared/Constants/Selectors.js');

//
// Parse the configuration out of the `.yaml` files.
//
const buildConfig = Object.assign(
    utils.parseYaml('Build/Selenium/Settings.yaml.example'),
    utils.parseYaml('Build/Selenium/Settings.yaml', 'Neos UI: No customized Settings.yaml for selenium was found. This may lead to unexpected problems since we need login credentials for the neos backend.')
).WebdriverIO;
const credentials = buildConfig.credentials;

//
// List of keys which are depending on the plattform this script will run on.
//
const keys = {
    CTRL_CMD: process.platform === 'darwin' ? 'Command' : 'Control'
};

//
// Create the main config object for the wdio test runner.
//
const config = {
    updateJob: true,
    specs: [
        './Tests/**/*.story.js'
    ],
    capabilities: [{
        browserName: 'firefox'
    }],
    logLevel: 'verbose',
    coloredLogs: true,
    screenshotPath: './Build/Selenium/Screenshots/',
    baseUrl: buildConfig.baseUrl,
    waitforTimeout: 60000,
    connectionRetryTimeout: 90000,
    connectionRetryCount: 3,
    services: ['sauce'],
    framework: 'mocha',
    reporters: ['dot'],
    mochaOpts: {
        ui: 'bdd',
        compilers: ['js:babel-core/register']
    },

    //
    // Bootstrap the environment.
    //
    before() {
        // Automatically log-in into the backend with the provided credentials.
        browser.url(buildConfig.url);
        browser.setValue('#username', credentials.username);
        browser.setValue('#password', credentials.password);
        browser.submitForm('[name="login"]');

        // Attach the global helper methods and selectors to the test suite.
        __neosSelenium = {
            selectors: selectors, //eslint-disable-line
            keys: keys //eslint-disable-line
        };

        // Setup chai as our assertion library.
        const chai = require('chai');
        const chaiAsPromised = require('chai-as-promised');

        chai.should();
        chai.use(chaiAsPromised);
        expect = chai.expect;
        chaiAsPromised.transferPromiseness = browser.transferPromiseness;
    }
};

//
// Adjust some settings for CI runs.
//
if (utils.env.isCi) {
    config.user = process.env.SAUCE_USERNAME;
    config.key = process.env.SAUCE_ACCESS_KEY;

    config.capabilities = [{
        'browserName': 'chrome',
        'platform': 'XP',
        'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
        'name': '#' + process.env.TRAVIS_JOB_NUMBER + ' ' + process.env.TRAVIS_REPO_SLUG + ': ' + process.env.COMMIT_MESSAGE, //eslint-disable-line
        'build': process.env.TRAVIS_BUILD_NUMBER,
        'screenResolution': '1280x800'
    }];
}

exports.config = config;
