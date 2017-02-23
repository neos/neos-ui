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
            filename: 'Plugin.js',
        },
        resolveLoader: {
            modulesDirectories: [
                path.resolve(__dirname, '../../node_modules')
            ]
        },
        resolve: { // override config!
            alias: {
                'react': '@neos-project/neos-ui-extensibility/src/shims/react/index'
            }
        }
    });
};
