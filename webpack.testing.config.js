const path = require('path');
const glob = require('glob');
const config = require('./webpack.shared.config.js');

//
// Find all files ending with '.spec.js' and map the filepath to a relative one.
//
const tests = glob.sync('Resources/Private/JavaScript/**/*.spec.js').map(test => `./${test}`);

module.exports = Object.assign({}, config, {
    entry: {
        tests
    },

    output: {
        filename: 'JavaScript/Tests.js',
        path: path.resolve('./Resources/Public/')
    }
});
