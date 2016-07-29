const {
    baseConfig,
    hostConfig,
    inspectorEditorConfig
} = require('./webpack.base.config');
const merge = require('lodash.merge');


const GuestConfig = merge({}, baseConfig, {
    entry: {
        Guest: './Resources/Private/JavaScript/Guest/index.js'
    }
});


module.exports = [
    merge({}, baseConfig, hostConfig),
    merge({}, baseConfig, inspectorEditorConfig),
    merge({}, baseConfig, GuestConfig)
];
