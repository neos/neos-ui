const webpack = require('webpack');
const path = require('path');
const glob = require('glob');
const config = require('./webpack.shared.config.js');

//
// Find all files ending with '.spec.js' and map the filepath to a relative one.
//
const tests = glob.sync('Resources/Private/JavaScript/**/*.spec.js').map(test => `./${test}`);

//
// Workaround for sinon since it requires itself, and webpack can't find the circular dependencies.
//
// @see https://github.com/webpack/webpack/issues/177
//
const loaders = Object.create(config.module.loaders);
const resolve = Object.create(config.resolve);
loaders.push({
    test: /sinon\.js$/,
    loader: 'imports?define=>false,require=>false'
});

if (!resolve.alias) {
    resolve.alias = {};
}
resolve.alias.sinon = 'sinon/pkg/sinon';

//
// Setup for the
//
const plugins = [].concat(config.plugins);
plugins.push(new webpack.IgnorePlugin(/ReactContext/));

//
// Export the webpack configuration for the test environment.
//
module.exports = Object.assign({}, config, {
    entry: {
        tests
    },

    output: {
        filename: 'JavaScript/Tests.js',
        path: path.resolve('./Resources/Public/')
    },

    module: {
        loaders
    },

    resolve,
    plugins
});
