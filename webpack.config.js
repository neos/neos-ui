const sharedWebPackConfig = require('./packages/build-essentials/src/webpack.config.js');
const path = require('path');

module.exports = Object.assign({}, sharedWebPackConfig, {
    entry: {
        Host: './packages/neos-ui/src/index.js',
        HostOnlyStyles: './packages/neos-ui/src/styleHostOnly.css',
        Guest: './packages/neos-ui-ckeditor-bindings/src/index.js',
        Vendor: [
            'react',
            'react-redux',
            'plow-js',
            'immutable'
        ]
    },

    resolve: {
        modulesDirectories: [
            path.resolve(__dirname, './packages/neos-ui/node_modules'),
            path.resolve(__dirname, './node_modules')
        ]
    }
});
