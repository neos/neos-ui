const webpackConfig = require('./webpack.testing.config.js');

module.exports = function (config) {
    config.set({
        port: 9876,

        files: [
            //
            // Since `PhantomJS` itself uses an outdated V8 core,
            // we need to polyfill a lot of ES5 & E2015 functionallity.
            //
            './node_modules/phantomjs-polyfill/bind-polyfill.js',
            './node_modules/babel-polyfill/browser.js',
            './node_modules/whatwg-fetch/fetch.js',
            'karma.entry.js'
        ],
        preprocessors: {
            'karma.entry.js': 'webpack'
        },
        browsers: ['PhantomJS'],
        frameworks: ['mocha', 'sinon-chai'],
        reporters: ['mocha', 'coverage'],
        plugins: [
            'karma-phantomjs-launcher',
            'karma-chai',
            'karma-sinon-chai',
            'karma-mocha',
            'karma-sourcemap-loader',
            'karma-webpack',
            'karma-coverage',
            'karma-mocha-reporter'
        ],
        webpack: webpackConfig,
        webpackServer: {
            noInfo: true
        },
        mochaReporter: {
            showDiff: true
        },
        coverageReporter: {
            type: 'lcov',
            dir: 'Coverage/'
        }
    });
};
