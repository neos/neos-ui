const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const LiveReloadPlugin = require('webpack-livereload-plugin');
const env = require('./environment');
const brand = require('@neos-project/brand');
const styles = require('./styleConfig');
//
// Prevent from failing, when NEOS_BUILD_ROOT env variable isn't set
// (e.g. when extending this config from storybook)
//
const rootPath = env.rootPath || __dirname;

//
// Create the vars object for:
//    - brand vars like colors and font settings
//    - global css variables for Neos.Ui
// for the `postcss-css-variables` plugin.
//
const brandVars = brand.generateCssVarsObject(brand.config, 'brand');
const styleVars = styles.generateCssVarsObject(styles.config);

const webpackConfig = {
    // https://github.com/webpack/docs/wiki/build-performance#sourcemaps
    devtool: 'source-map',
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules\/((?!@neos-project).)*$/,
                loader: 'babel'
            },
            {
                test: /\.json$/,
                exclude: /node_modules\/((?!@neos-project).)*$/,
                loader: 'json-loader'
            },
            {
                test: /\.(woff|woff2|eot|ttf|svg)$/,
                loader: 'url-loader?limit=10000&name=./Styles/Font-[hash].[ext]&publicPath=./../'
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader')
            },
            {
                test: /\.vanilla-css$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
            }
        ]
    },

    postcss: [
        require('autoprefixer')({
            browsers: ['last 2 versions']
        }),
        require('postcss-css-variables')({
            variables: Object.assign({
                //
                // Spacings
                //
                '--goldenUnit': '40px',
                '--spacing': '16px',
                '--halfSpacing': '8px',
                '--quarterSpacing': '4px',

                //
                // Sizes
                //
                '--sidebarWidth': '320px',

                //
                // Font sizes
                //
                '--baseFontSize': '14px'
            }, styleVars, brandVars)
        }),
        require('postcss-import')(),
        require('postcss-nested')(),
        require('postcss-hexrgba')()
    ],

    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV)
            }
        }),
        new webpack.optimize.OccurenceOrderPlugin(),
        new ExtractTextPlugin('./Styles/[name].css', {allChunks: true}),
        new webpack.optimize.CommonsChunkPlugin({names: ['Vendor']})
    ],

    resolve: {
        modulesDirectories: [
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

module.exports = webpackConfig;
