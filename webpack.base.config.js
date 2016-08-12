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
    // TODO: LIVE RELOADING DOES NOT WORK WITH CODE SPLITTING
    //baseConfig.plugins.push(new LiveReloadPlugin({appendScriptTag: true}));
}

//
// Additional config parts for different builds.
//
const hostConfig = {
    resolve: {
        root: [
            path.resolve(__dirname, 'Resources/Private/JavaScript')
        ],
        modulesDirectories: [
            'node_modules',
            path.resolve(__dirname, './node_modules')
        ]
    },

    entry: {
        Host: './Resources/Private/JavaScript/Host/index.js',
        HostOnlyStyles: './Resources/Private/JavaScript/Host/styleHostOnly.css'
    }
};

const inspectorEditorConfig = {
    resolve: {
        root: [
            path.resolve(__dirname, 'Resources/Private/JavaScript'),
            path.resolve(__dirname, './inspector_node_modules')
        ],
        alias: {
            'react': path.resolve(__dirname, 'Resources/Private/JavaScript/Host/Extensibility/API/_internal/react/'),
            'plow-js': path.resolve(__dirname, 'Resources/Private/JavaScript/Host/Extensibility/API/_internal/plow-js/index'),
            'immutable': path.resolve(__dirname, 'Resources/Private/JavaScript/Host/Extensibility/API/_internal/immutable/'),
            'Components': path.resolve(__dirname, 'Resources/Private/JavaScript/Host/Extensibility/API/_internal/components/'),
            'I18n': path.resolve(__dirname, 'Resources/Private/JavaScript/Host/Extensibility/API/_internal/I18n/'),
            'Host/Extensibility/API': path.resolve(__dirname, 'Resources/Private/JavaScript/Host/Extensibility/API/'),
        },
        modulesDirectories: ['nonExistant']
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
