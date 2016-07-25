const {
    baseConfig,
    hostConfig,
    inspectorEditorConfig
} = require('./webpack.base.config');
const merge = require('lodash.merge');


const GuestConfig = merge({}, defaultConfig, {
    entry: {
        RealGuest: './Resources/Private/JavaScript/RealGuest/index.js'
    }
});


module.exports = [
    merge({}, baseConfig, hostConfig),
    merge({}, baseConfig, inspectorEditorConfig),
    merge({}, baseConfig, {
        entry: {
            RealGuest: './Resources/Private/JavaScript/RealGuest/index.js'
        }
    })
];
