const fs = require('fs');
const defaultConfig = require('./webpack.base.config');
const merge = require('lodash.merge');
const path = require('path');

const HostConfig = merge({}, defaultConfig, {
    entry: {
        Host: './Resources/Private/JavaScript/Host/index.js',

        //
        // Workaround according to https://github.com/webpack/webpack/issues/300,
        // since entry points are not allowed as dependencies in webpack?!?
        //
        Components: ['./Resources/Private/JavaScript/Components/index.js'],
        Guest: './Resources/Private/JavaScript/Guest/index.js'
    }
});

const InspectorEditorConfig = merge({}, defaultConfig, {
    resolve: {
        alias: {
            '@host': path.resolve(__dirname, 'Resources/Private/JavaScript/Host/Extensibility/API/'),
            'react': path.resolve(__dirname, 'Resources/Private/JavaScript/Host/Extensibility/API/react/')
        }
    },
    entry: {
        InspectorEditors: './Resources/Private/JavaScript/InspectorEditors/index.js'
    }
});

module.exports = [
    HostConfig,
    InspectorEditorConfig
];
