const {
    baseConfig,
    hostConfig,
    inspectorEditorConfig
} = require('./webpack.base.config');
const merge = require('lodash.merge');

module.exports = [
    merge({}, baseConfig, hostConfig),
    merge({}, baseConfig, inspectorEditorConfig)
];
