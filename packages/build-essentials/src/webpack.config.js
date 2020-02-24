const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const LiveReloadPlugin = require('webpack-livereload-plugin');
const env = require('./environment');
//
// Prevent from failing, when NEOS_BUILD_ROOT env variable isn't set
// (e.g. when extending this config from storybook)
//
const rootPath = env.rootPath || __dirname;

const liveReloadOptionsFileName = '.webpack.livereload.local.js';
const liveReloadOptionsFile = path.join(rootPath, liveReloadOptionsFileName);

const mandatoryLiveReloadOptions = {appendScriptTag: true};

let finalLiveReloadOptions = Object.assign({}, mandatoryLiveReloadOptions);

if (fs.existsSync(liveReloadOptionsFile) && fs.lstatSync(liveReloadOptionsFile).isFile()) {
    const liveReloadOptions = require(liveReloadOptionsFile);
    finalLiveReloadOptions = Object.assign({}, finalLiveReloadOptions, liveReloadOptions);
}

const webpackConfig = {
    // https://github.com/webpack/docs/wiki/build-performance#sourcemaps
    devtool: 'source-map',
    mode: env.isProduction ? 'production' : 'development',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules\/(?!@ckeditor)(?!@neos-project).*$/,
                use: [{
                    loader: 'babel-loader'
                }]
            },
            {
                test: /\.js$/,
                include: [
                    /node_modules\/debug/,
                    /node_modules\/d3-scale/,
                    /node_modules\/d3-array/
                ],
                use: [{
                    loader: 'babel-loader'
                }]
            },
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: [{
                    loader: 'ts-loader'
                }]
            },
            {
                type: 'javascript/auto',
                test: /\.json$/,
                exclude: /node_modules\/(?!@neos-project).*$/,
                use: [{
                    loader: 'json-loader'
                }]
            },
            {
                test: /node_modules\/@ckeditor\/.*\.svg$/,
                use: ['raw-loader']
            },
            {
                test: /node_modules\/@ckeditor\/.*\.css$/,
                use: ['null-loader']
            },
            {
                test: /\.(woff|woff2|eot|ttf|svg)$/,
                exclude: /node_modules\/@ckeditor.*$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        name: './Styles/Font-[hash].[ext]',
                        publicPath: './../'
                    }
                }]
            },
            {
                test: /node_modules\/@fortawesome\/fontawesome-svg-core\/styles\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: './../'
                        }
                    },
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'string-replace-loader',
                        options: {
                            search: 'svg-inline--fa',
                            replace: 'neos-svg-inline--fa',
                            flags: 'g'
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                exclude: [
                    /node_modules\/@fortawesome\/fontawesome-svg-core\/styles\.css$/,
                    /node_modules\/@ckeditor.*$/
                ],
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: './../'
                        }
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                localIdentName: '[name]__[local]___[hash:base64:5]'
                            },
                            importLoaders: 1
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            config: {
                                path: path.join(__dirname, 'postcss.config.js')
                            }
                        }
                    }
                ]
            },
            {
                test: /\.vanilla-css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: './../'
                        }
                    },
                    {
                        loader: 'css-loader'
                    }
                ]
            }
        ]
    },

    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV)
            }
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new MiniCssExtractPlugin({filename: './Styles/[name].css'})
    ],

    optimization: {
        splitChunks: {
            name: 'Vendor'
        },
        minimizer: []
    },

    resolve: {
        modules: [
            path.resolve(rootPath, './node_modules')
        ],
        extensions: ['.ts', '.tsx', '.js']
    },

    output: {
        filename: 'JavaScript/[name].js',
        path: path.resolve(__dirname, '../../../Resources/Public/')
    },
    stats: {
        assets: false,
        children: false
    },
    performance: {
        hints: env.isProduction ? 'warning' : false
    }
};

//
// Adjust the config depending on the env.
//
if (!env.isCi && !env.isTesting && !env.isStorybook && !env.isProduction) {
    // TODO: LIVE RELOADING DOES NOT WORK WITH CODE SPLITTING
    webpackConfig.plugins.push(new LiveReloadPlugin(finalLiveReloadOptions));
}

/* eslint camelcase: ["error", {properties: "never"}] */
if (env.isProduction) {
    webpackConfig.optimization.minimizer.push(
        new TerserPlugin({
            terserOptions: {
                sourceMap: true,
                warnings: false,
                parse: {},
                compress: {},
                mangle: true,
                keep_fnames: true
            }
        }),
    );
}

module.exports = webpackConfig;
