const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
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

const extractCss = new ExtractTextPlugin({
    publicPath: './../',
    filename: 'Styles/[name].css'
});

const webpackConfig = {
    // https://github.com/webpack/docs/wiki/build-performance#sourcemaps
    devtool: 'source-map',
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
                test: /node_modules\/@fortawesome\/fontawesome\/styles\.css$/,
                use: extractCss.extract({
                    use: [{
                        loader: 'css-loader'
                    }, {
                        loader: 'string-replace-loader',
                        options: {
                            search: 'svg-inline--fa',
                            replace: 'neos-svg-inline--fa',
                            flags: 'g'
                        }
                    }],
                    fallback: 'style-loader'
                })
            },
            {
                test: /\.css$/,
                exclude: /node_modules\/@fortawesome\/fontawesome\/styles\.css$/,
                use: extractCss.extract({
                    use: [{
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            importLoaders: 1,
                            localIdentName: '[name]__[local]___[hash:base64:5]'
                        }
                    }, {
                        loader: 'postcss-loader',
                        options: {
                            config: {
                                path: path.join(__dirname, 'postcss.config.js')
                            }
                        }
                    }],
                    fallback: 'style-loader'
                })
            },
            {
                test: /\.vanilla-css$/,
                use: extractCss.extract({
                    use: [{
                        loader: 'css-loader'
                    }],
                    fallback: 'style-loader'
                })
            }
        ]
    },

    plugins: [
        extractCss,
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV)
            }
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new ExtractTextPlugin('./Styles/[name].css', {allChunks: true}),
        new webpack.optimize.CommonsChunkPlugin({names: ['Vendor']})
    ],

    resolve: {
        modules: [
            path.resolve(rootPath, './node_modules')
        ]
    },

    output: {
        filename: 'JavaScript/[name].js',
        path: path.resolve(__dirname, '../../../Resources/Public/')
    },
    stats: {
        assets: false,
        children: false
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
    webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({
        sourceMap: true,
        minimize: true,
        compress: {
            keep_fnames: true,
            warnings: false
        },
        mangle: {
            keep_fnames: true
        }
    }));
}

webpackConfig.__internalDependencies = {
    ExtractTextPlugin
};

module.exports = webpackConfig;
