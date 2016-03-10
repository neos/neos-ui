#!/usr/bin/env node

'use strict';

const fs = require('fs');

let config = {
    tests: './*.story.js',
    timeout: 10000,
    output: './output',
    helpers: {
        WebDriverIO: {
            url: "http://localhost:8081",
            host: 'localhost',
            port: 4445,

            browser: "firefox",
            user:  process.env.SAUCE_USERNAME,
            key: process.env.SAUCE_ACCESS_KEY,
            desiredCapabilities: {
                browserName: 'firefox',
                platform: 'XP',
                'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
                name: '#' + process.env.TRAVIS_JOB_NUMBER + ' ' + process.env.TRAVIS_REPO_SLUG + ': ' + process.env.COMMIT_MESSAGE, //eslint-disable-line
                build: process.env.TRAVIS_BUILD_NUMBER,
                screenResolution: '1280x800'
            },
            logLevel: "warn",
            coloredLogs: true,
            waitforTimeout: 10000
        },
        Frame: {
          "require": "./neos_helper.js"
        }
    },
    include: {
        I: './steps_file.js'
    },
    bootstrap: false,
    mocha: {},
    name: 'TestCodeceptIo'
};

fs.writeFile('Tests/TestCodeceptIo/codecept.json', JSON.stringify(config), 'utf8');
