const yaml = require('js-yaml');
const fs = require('fs');

function readYaml(path) {
    var data = {};

    try {
        data = yaml.safeLoad(fs.readFileSync(path, 'utf8'));
    } catch (e) {
        console.log(e);
    }

    return data;
}

const defaultConfig = readYaml('Build/TestSuite.Settings.yaml.example');
const buildConfig = Object.assign(defaultConfig, readYaml('Build/TestSuite.Settings.yaml')).WebdriverIO;
const credentials = buildConfig.credentials;

const config = {
    updateJob: true,
    specs: [
        './Resources/Private/JavaScript/**/*.behavior.js'
    ],
    capabilities: [{
        browserName: 'firefox'
    }],
    logLevel: 'result',
    coloredLogs: true,
    screenshotPath: './Build/Selenium/Screenshots/',
    baseUrl: buildConfig.baseUrl,
    waitforTimeout: 10000,
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
    // Automatically log-in into the backend before the testsuite starts.
    //
    before() {
        browser.url(buildConfig.url);
        browser.setValue('#username', credentials.username);
        browser.setValue('#password', credentials.password);
        browser.submitForm('[name="login"]');

        const chai = require('chai');

        expect = chai.expect;
        chai.should();
    }
};

//
// Adjust some settings for CI runs.
//
if (process.env.CI) {
    config.user = process.env.SAUCE_USERNAME;
    config.key = process.env.SAUCE_ACCESS_KEY;

    config.capabilities = [{
        'browserName': 'chrome',
        'version': '27.0',
        'platform': 'XP',
        'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
        'name': 'integration',
        'build': process.env.TRAVIS_BUILD_NUMBER
    }];
}

exports.config = config;
