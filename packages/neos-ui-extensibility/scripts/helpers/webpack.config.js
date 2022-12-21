const sharedWebPackConfig = require('@neos-project/build-essentials/src/webpack.config.js');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = function (neosPackageJson) {
    return Object.assign({}, sharedWebPackConfig, {
        mode: sharedWebPackConfig.mode,
        module: {
            rules: sharedWebPackConfig.module.rules.map(loaderConfig => {
                if (loaderConfig.use[0].loader === 'babel-loader') {
                    loaderConfig.use[0].options = {
                        babelrc: false,
                        presets: [
                            require.resolve('babel-preset-react'),
                            require.resolve('babel-preset-stage-0')
                        ],
                        plugins: [
                            require.resolve('babel-plugin-transform-decorators-legacy'),
                            require.resolve('babel-plugin-transform-object-rest-spread'),
                            // The following plugins are copied from the es2015 preset, but without the class transform
                            // which is not compatible with our Neos UI build since 8.2
                            require.resolve('babel-plugin-transform-es2015-template-literals'),
                            require.resolve('babel-plugin-transform-es2015-literals'),
                            require.resolve('babel-plugin-transform-es2015-function-name'),
                            require.resolve('babel-plugin-transform-es2015-arrow-functions'),
                            require.resolve('babel-plugin-transform-es2015-block-scoped-functions'),
                            require.resolve('babel-plugin-transform-es2015-object-super'),
                            require.resolve('babel-plugin-transform-es2015-shorthand-properties'),
                            require.resolve('babel-plugin-transform-es2015-duplicate-keys'),
                            require.resolve('babel-plugin-transform-es2015-computed-properties'),
                            require.resolve('babel-plugin-transform-es2015-for-of'),
                            require.resolve('babel-plugin-transform-es2015-sticky-regex'),
                            require.resolve('babel-plugin-transform-es2015-unicode-regex'),
                            require.resolve('babel-plugin-check-es2015-constants'),
                            require.resolve('babel-plugin-transform-es2015-spread'),
                            require.resolve('babel-plugin-transform-es2015-parameters'),
                            require.resolve('babel-plugin-transform-es2015-destructuring'),
                            require.resolve('babel-plugin-transform-es2015-block-scoping'),
                            require.resolve('babel-plugin-transform-es2015-typeof-symbol'),
                            require.resolve('babel-plugin-transform-es2015-modules-commonjs'),
                            [require.resolve('babel-plugin-transform-regenerator'), {async: false, asyncGenerators: false}]
                        ]
                    };
                }

                return loaderConfig;
            })
        },
        entry: {
            Plugin: './src/index.js'
        },
        plugins: [
            new MiniCssExtractPlugin({filename: './[name].css'})
        ],
        output: {
            path: path.resolve(process.cwd(), neosPackageJson.buildTargetDirectory),
            filename: 'Plugin.js'
        },
        resolveLoader: {
            modules: [
                // not sure if we need this path still.
                path.resolve(__dirname, '../../node_modules'),

                // this path is the correct one when building an external Neos Module.
                path.resolve(__dirname, '../../../../../node_modules')
            ]
        },
        resolve: { // override config!
            extensions: ['.ts', '.tsx', '.js'],
            alias: {
                'react': '@neos-project/neos-ui-extensibility/src/shims/vendor/react/index',
                'react-dom': '@neos-project/neos-ui-extensibility/src/shims/vendor/react-dom/index',
                'react-dnd': '@neos-project/neos-ui-extensibility/src/shims/vendor/react-dnd/index',
                'react-dnd-html5-backend': '@neos-project/neos-ui-extensibility/src/shims/vendor/react-dnd-html5-backend/index',
                'prop-types': '@neos-project/neos-ui-extensibility/src/shims/vendor/prop-types/index',
                'plow-js': '@neos-project/neos-ui-extensibility/src/shims/vendor/plow-js/index',
                'classnames': '@neos-project/neos-ui-extensibility/src/shims/vendor/classnames/index',
                'react-redux': '@neos-project/neos-ui-extensibility/src/shims/vendor/react-redux/index',
                'redux-actions': '@neos-project/neos-ui-extensibility/src/shims/vendor/redux-actions/index',
                'redux-saga/effects': '@neos-project/neos-ui-extensibility/src/shims/vendor/redux-saga-effects/index',
                'redux-saga': '@neos-project/neos-ui-extensibility/src/shims/vendor/redux-saga/index',
                'reselect': '@neos-project/neos-ui-extensibility/src/shims/vendor/reselect/index',
                '@friendsofreactjs/react-css-themr': '@neos-project/neos-ui-extensibility/src/shims/vendor/react-css-themr/index',
                'ckeditor5-exports': '@neos-project/neos-ui-extensibility/src/shims/vendor/ckeditor5-exports/index',

                '@neos-project/react-ui-components': '@neos-project/neos-ui-extensibility/src/shims/neosProjectPackages/react-ui-components/index',
                '@neos-project/neos-ui-backend-connector': '@neos-project/neos-ui-extensibility/src/shims/neosProjectPackages/neos-ui-backend-connector/index',
                '@neos-project/neos-ui-ckeditor5-bindings': '@neos-project/neos-ui-extensibility/src/shims/neosProjectPackages/neos-ui-ckeditor5-bindings/index',
                '@neos-project/neos-ui-decorators': '@neos-project/neos-ui-extensibility/src/shims/neosProjectPackages/neos-ui-decorators/index',
                '@neos-project/neos-ui-editors': '@neos-project/neos-ui-extensibility/src/shims/neosProjectPackages/neos-ui-editors/index',
                '@neos-project/neos-ui-i18n': '@neos-project/neos-ui-extensibility/src/shims/neosProjectPackages/neos-ui-i18n/index',
                '@neos-project/neos-ui-redux-store': '@neos-project/neos-ui-extensibility/src/shims/neosProjectPackages/neos-ui-redux-store/index',
                '@neos-project/neos-ui-views': '@neos-project/neos-ui-extensibility/src/shims/neosProjectPackages/neos-ui-views/index',
                '@neos-project/neos-ui-guest-frame': '@neos-project/neos-ui-extensibility/src/shims/neosProjectPackages/neos-ui-guest-frame/index',
                '@neos-project/utils-redux': '@neos-project/neos-ui-extensibility/src/shims/neosProjectPackages/utils-redux/index'
            }
        }
    });
};
