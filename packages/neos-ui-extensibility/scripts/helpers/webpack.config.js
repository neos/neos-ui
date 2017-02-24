const sharedWebPackConfig = require('@neos-project/build-essentials/src/webpack.config.js');
const path = require('path');


module.exports = function(neosPackageJson) {

    return Object.assign({}, sharedWebPackConfig, {
        module: {
            loaders: sharedWebPackConfig.module.loaders.map(loaderConfig => {
                if (loaderConfig.loader === 'babel') {
                    loaderConfig.query = {
                        babelrc: false,
                        presets: [
                            require.resolve("babel-preset-react"),
                            require.resolve("babel-preset-es2015"),
                            require.resolve("babel-preset-stage-0")
                        ],
                        plugins: [
                            require.resolve("babel-plugin-transform-decorators-legacy"),
                            require.resolve("babel-plugin-transform-object-rest-spread")
                        ]
                    };
                }

                return loaderConfig;
            })
        },
        entry: {
            Plugin: './src/index.js'
        },
        plugins: [], // REMOVE plugins; use default!
        output: {
            path: neosPackageJson.buildTargetDirectory,
            filename: 'Plugin.js'
        },
        resolveLoader: {
            modulesDirectories: [
                path.resolve(__dirname, '../../node_modules')
            ]
        },
        resolve: { // override config!
            alias: {
                'react': '@neos-project/neos-ui-extensibility/src/shims/vendor/react/index',
                'immutable': '@neos-project/neos-ui-extensibility/src/shims/vendor/immutable/index',
                'plow-js': '@neos-project/neos-ui-extensibility/src/shims/vendor/plow-js/index',
                'classnames': '@neos-project/neos-ui-extensibility/src/shims/vendor/classnames/index',
                'react-immutable-proptypes': '@neos-project/neos-ui-extensibility/src/shims/vendor/react-immutable-proptypes/index',
                'react-redux': '@neos-project/neos-ui-extensibility/src/shims/vendor/react-redux/index',
                'redux-actions': '@neos-project/neos-ui-extensibility/src/shims/vendor/redux-actions/index',
                'redux-saga/effects': '@neos-project/neos-ui-extensibility/src/shims/vendor/redux-saga-effects/index',
                'redux-saga': '@neos-project/neos-ui-extensibility/src/shims/vendor/redux-saga/index',
                'reselect': '@neos-project/neos-ui-extensibility/src/shims/vendor/reselect/index',

                '@neos-project/react-ui-components': '@neos-project/neos-ui-extensibility/src/shims/neosProjectPackages/react-ui-components/index'
            }
        }
    });
};
