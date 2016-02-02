const fs = require('fs');
const webpackConfig = require('./webpack.config.js');
const babelConfig = JSON.parse(fs.readFileSync('./.babelrc', 'utf8'));

module.exports = function (config) {
    config.set({
        port: 9876,
        singleRun: true,
        files: [
            //
            // Since `PhantomJS` itself uses an outdated V8 core,
            // we need to polyfill a lot of ES5 & E2015 functionallity.
            //
            './node_modules/phantomjs-polyfill/bind-polyfill.js',
            './node_modules/babel-polyfill/browser.js',
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
        webpack: Object.assign({}, webpackConfig, {
            devtool: 'inline-source-map',

            module: {
                preLoaders: [
                    //
                    // Since the coverage of karma doesn't relate to the ES2015 source files,
                    // we need to use the isparta loader which will handle the generation of ES2015 coverage metrics.
                    //
                    // Since the `.spec.js` should not be included in the coverage metrics, they will be compiled
                    // traditionally via `babel` instead.
                    //
                    // Note: Isparta itself uses babel as well, so all changes in the `.babelrc` will be reflected in
                    // the test suite as well.
                    //
                    {
                        test: /\.sepc.js$/,
                        loader: 'babel'
                    },
                    {
                        test: /\.js$/,
                        exclude: /(node_modules|bower_components)\/|\.spec.js$/,
                        loader: 'isparta'
                    }
                ],

                loaders: webpackConfig.module.loaders.concat(
                    //
                    // Workaround for sinon since it requires itself,
                    // and webpack can't handle circular dependencies.
                    //
                    // @see https://github.com/webpack/webpack/issues/177
                    //
                    {
                        test: /sinon\.js$/,
                        loader: 'imports?define=>false,require=>false'
                    }
                )
            },

            isparta: {
                embedSource: true,
                noAutoWrap: true,
                babel: babelConfig
            }
        }),
        webpackServer: {
            noInfo: true
        },
        coverageReporter: {
            type: 'lcov',
            dir: 'Coverage/'
        }
    });
};
