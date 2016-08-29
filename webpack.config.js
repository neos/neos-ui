const config = require('./webpack.base.config');
const merge = require('lodash.merge');


const GuestConfig = {
    entry: {
        Guest: './Resources/Private/JavaScript/Guest/index.js'
    }
};


module.exports = [
    merge({}, config.baseConfig, config.hostConfig),
    merge({}, config.baseConfig, config.inspectorEditorConfig),
    merge({}, config.baseConfig, GuestConfig)
];
