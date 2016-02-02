const webpackConfig = require('./webpack.config.js');
const babelConfig = require('./.babelrc');

module.exports = function (config) {
    config.set({
        browsers: ['PhantomJS'],
        singleRun: true,
        frameworks: ['mocha', 'sinon-chai'],
        files: [
            './node_modules/phantomjs-polyfill/bind-polyfill.js',
            './node_modules/babel-polyfill/browser.js',
            'webpack.tests.js'
        ],
        preprocessors: {
            'webpack.tests.js': 'webpack'
        },
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
        reporters: ['mocha', 'coverage'],
        webpack: Object.assign({}, webpackConfig, {
            devtool: 'inline-source-map',

            module: {
                preLoaders: [
                    // Transpile all the spec files with babel.
                    {
                        test: /\.sepc.js$/,
                        loader: 'babel'
                    },
                    // Transpile and instrument the testing source files with isparta.
                    {
                        test: /\.js$/,
                        exclude: /(node_modules|bower_components)\/|\.spec.js$/,
                        loader: 'isparta'
                    }
                ],

                loaders: webpackConfig.module.loaders.concat(
                    //
                    // Workaround for sinon since it requires itself, and webpack can't find the circular dependencies.
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
