const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');
const path = require('path');
const vars = require('postcss-simple-vars');
const hexToRgba = require('postcss-hexrgba');
const postCssImport = require('postcss-import');
const nested = require('postcss-nested');
const LiveReloadPlugin = require('webpack-livereload-plugin');
const env = require('./Build/Utilities/').env;

const baseConfig = {
    // https://github.com/webpack/docs/wiki/build-performance#sourcemaps
    devtool: 'source-map',
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
        autoprefixer({
            browsers: ['last 2 versions']
        }),
        vars({
            variables: require('./Resources/Private/JavaScript/Shared/Constants/Theme.js')
        }),
        postCssImport(),
        nested(),
        hexToRgba()
    ],

    resolve: {
        root: [
            path.resolve(__dirname, 'Resources/Private/JavaScript')
        ],
        modulesDirectories: [
            'node_modules',
            path.resolve(__dirname, './node_modules')
        ]
    },

    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new ExtractTextPlugin('./Styles/[name].css', {allChunks: true})
    ],

    //
    // Hint: This part is filled dynamically inside webpack.config.js
    // based on the individual configs of the builds.
    //
    entry: {},

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
    baseConfig.plugins.push(new LiveReloadPlugin({appendScriptTag: true}));
}

//
// Additional config parts for different builds.
//
const hostConfig = {
    entry: {
        Host: './Resources/Private/JavaScript/Host/index.js',
        HostOnlyStyles: './Resources/Private/JavaScript/Host/styleHostOnly.css'
    }
};

const inspectorEditorConfig = {
    resolve: {
        alias: {
            '@host': path.resolve(__dirname, 'Resources/Private/JavaScript/Host/Extensibility/API/'),
            'react': path.resolve(__dirname, 'Resources/Private/JavaScript/Host/Extensibility/API/react/')
        }
    },
    entry: {
        InspectorEditors: './Resources/Private/JavaScript/InspectorEditors/index.js'
    }
};

module.exports = {
    baseConfig,
    hostConfig,
    inspectorEditorConfig
};
