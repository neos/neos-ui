const config = require('./webpack.shared.config.js');
const path = require('path');
const glob = require('glob');

module.exports = Object.assign({}, config, {
    entry: {
        tests: glob.sync('Resources/Private/JavaScript/**/*.spec.js')
    },

    output: {
        filename: 'JavaScript/Tests.js',
        path: path.resolve('./Resources/Public/')
    }
});
