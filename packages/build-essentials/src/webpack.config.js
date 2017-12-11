const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const LiveReloadPlugin = require('webpack-livereload-plugin');
const env = require('./environment');
//
// Prevent from failing, when NEOS_BUILD_ROOT env variable isn't set
// (e.g. when extending this config from storybook)
//
const rootPath = env.rootPath || __dirname;

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
                exclude: /node_modules\/((?!@neos-project).)*$/,
                use: [{
                    loader: 'babel-loader'
                }]
            },
            {
                test: /\.json$/,
                exclude: /node_modules\/((?!@neos-project).)*$/,
                use: [{
                    loader: 'json-loader'
                }]
            },
            {
                test: /\.(woff|woff2|eot|ttf|svg)$/,
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
                test: /\.css$/,
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
    webpackConfig.plugins.push(new LiveReloadPlugin({appendScriptTag: true}));
}

/* eslint camelcase: ["error", {properties: "never"}] */
if (env.isProduction) {
    webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({
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
