const webpackConfig = require('./webpack.config.js');
const filePattern = 'Resources/Private/JavaScript/**/*.spec.js';

// Delay the coverage until all tests are run.
webpackConfig.devtool = 'inline-source-map';
webpackConfig.module.postLoaders.push({
    test: /\.js$/,
    exclude: /(test|node_modules|bower_components)\//,
    loader: 'istanbul-instrumenter'
});

module.exports = function (config) {
    config.set({
        browsers: ['Chrome'],
        singleRun: true,
        frameworks: ['mocha'],
        files: [
            filePattern
        ],
        plugins: [
            'karma-chrome-launcher',
            'karma-chai',
            'karma-mocha',
            'karma-sourcemap-loader',
            'karma-webpack',
            'karma-coverage',
            'karma-mocha-reporter'
        ],
        preprocessors: {
            [filePattern]: [
                'webpack',
                'sourcemap'
            ]
        },
        reporters: ['mocha', 'coverage'],
        webpack: webpackConfig,
        webpackServer: {
            noInfo: true
        },
        coverageReporter: {
            type: 'html',
            dir: 'Coverage/'
        }
    });
};
