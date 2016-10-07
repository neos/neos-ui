const webpack = require('webpack');
const fs = require('fs');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const LiveReloadPlugin = require('webpack-livereload-plugin');
const env = require('./Build/Utilities/').env;
const brand = require('@neos-project/brand');

//
// Create the vars object for brand vars like colors and font settings
// for the `postcss-css-variables` plugin.
//
const brandVars = brand.generateCssVarsObject(brand.config, 'brand');

//
// Read all sub-directories of the `@neos-project/react-ui-components` package
// which will all be bundlded into the Vendor bundle.
//
const componentsLibDirs = fs.readdirSync(
    path.join(__dirname, './packages/neos-ui/node_modules/@neos-project/react-ui-components/lib/')
).filter(dir => (
    // Filter top level files and the `_lib` dir since they shall not be imported.
    dir.indexOf('.') === -1 &&
    dir !== '_lib'
));

const webpackConfig = {
    // https://github.com/webpack/docs/wiki/build-performance#sourcemaps
    devtool: 'source-map',
    entry: {
        Host: './packages/neos-ui/src/Host/index.js',
        HostOnlyStyles: './packages/neos-ui/src/Host/styleHostOnly.css',
        InspectorEditors: './packages/neos-ui/src/InspectorEditors/manifest.js',
        Guest: './packages/neos-ui/src/Guest/index.js',
        Vendor: [
            'react',
            'react-redux',
            'plow-js',
            'immutable'
        ].concat(
            componentsLibDirs.map(dir => `packages/neos-ui/node_modules/@neos-project/react-ui-components/lib/${dir}`)
        )
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                loader: 'babel'
            },
            {
                test: /\.(woff|woff2)$/,
                loader: 'url?limit=100000'
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader')
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
            }, brandVars)
        }),
        require('postcss-import')(),
        require('postcss-nested')(),
        require('postcss-hexrgba')()
    ],

    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new ExtractTextPlugin('./Styles/[name].css', {allChunks: true}),
        new webpack.optimize.CommonsChunkPlugin({names: ['Vendor']})
    ],

    resolve: {
        root: [
            path.resolve(__dirname, 'packages/neos-ui/src')
        ],
        modulesDirectories: [
            path.resolve(__dirname, './packages/neos-ui/node_modules')
        ],
        alias: {
            'I18n': path.resolve(__dirname, 'packages/neos-ui/src/Host/Extensibility/API/_internal/I18n/'),
            'Host/Extensibility/API': path.resolve(__dirname, 'packages/neos-ui/src/Host/Extensibility/API/')
        }
    },

    output: {
        filename: 'JavaScript/[name].js',
        path: path.resolve('./Resources/Public/')
    },
    stats: {
        assets: false,
        children: false
    }
};

//
// Adjust the config depending on the env.
//
if (!env.isCi && !env.isTesting && !env.isStorybook) {
    // TODO: LIVE RELOADING DOES NOT WORK WITH CODE SPLITTING
    webpackConfig.plugins.push(new LiveReloadPlugin({appendScriptTag: true}));
}

module.exports = webpackConfig;
