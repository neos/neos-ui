const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');
const path = require('path');
const vars = require('postcss-simple-vars');
const postCssImport = require('postcss-import');
const nested = require('postcss-nested');

module.exports = {
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                loader: 'babel',
                query: {
                    stage: 0
                }
            },
            {
                test: /\.(woff|woff2)$/,
                loader: 'url?limit=100000'
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader')
            }
        ],
        postLoaders: []
    },

    postcss: [
        autoprefixer({
            browsers: ['last 2 versions']
        }),
        vars({
            variables: require('./Resources/Private/JavaScript/Shared/Constants/Theme.js')
        }),
        postCssImport(),
        nested()
    ],

    resolve: {
        root: [path.resolve(__dirname, 'Resources/Private/JavaScript')],
        modulesDirectories: [
            'node_modules',
            path.resolve(__dirname, './node_modules')
        ]
    },

    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new ExtractTextPlugin('./Styles/[name].css', {allChunks: true})
    ]
};
