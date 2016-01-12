const path = require('path');
const config = require('./webpack.shared.config.js');

module.exports = Object.assign({}, config, {
    entry: {
        Host: './Resources/Private/JavaScript/Host/index.js',
        Guest: './Resources/Private/JavaScript/Guest/index.js',
        Login: './Resources/Private/JavaScript/Login/index.js'
    },

    output: {
        filename: 'JavaScript/[name].js',
        path: path.resolve('./Resources/Public/')
    }
});
