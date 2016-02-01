const webpackConfig = require('./webpack.config.js');
const filePattern = 'Resources/Private/JavaScript/**/*.spec.js';

//
// Delay the coverage until all tests are run.
//
webpackConfig.devtool = 'inline-source-map';
webpackConfig.module.postLoaders = [{
    test: /\.js$/,
    exclude: /(test|node_modules|bower_components)\//,
    loader: 'istanbul-instrumenter'
}];

//
// Workaround for sinon since it requires itself, and webpack can't find the circular dependencies.
//
// @see https://github.com/webpack/webpack/issues/177
//
webpackConfig.module.loaders.push({
    test: /sinon\.js$/,
    loader: 'imports?define=>false,require=>false'
});

module.exports = function (config) {
    config.set({
        browsers: ['Chrome'],
        singleRun: Boolean(process.env.CONTINUOUS_INTEGRATION),
        frameworks: ['mocha', 'sinon-chai'],
        files: [filePattern],
        plugins: [
            'karma-chrome-launcher',
            'karma-chai',
            'karma-sinon-chai',
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
