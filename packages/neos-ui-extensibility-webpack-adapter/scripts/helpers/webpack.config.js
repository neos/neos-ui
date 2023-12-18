const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const extensibilityMap = require("@neos-project/neos-ui-extensibility/extensibilityMap.json")

const isProduction = process.env.NODE_ENV === 'production';

/** @return {import("webpack").Configuration} */
module.exports = function (neosPackageJson) {
    return {
        mode: isProduction ? 'production' : 'development',
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules\/(?!@ckeditor)(?!@neos-project).*$/,
                    use: [{
                        loader: 'babel-loader',
                        options: {
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
                            ]
                        }
                    }]
                },
                {
                    test: /\.tsx?$/,
                    exclude: /node_modules/,
                    use: [{
                        loader: 'ts-loader'
                    }]
                },
                {
                    type: 'javascript/auto',
                    test: /\.json$/,
                    exclude: /node_modules\/(?!@neos-project).*$/,
                    use: [{
                        loader: 'json-loader'
                    }]
                },
                // those ckeditor loaders were originally only in place for the complete neos-ui build and
                // shouldnt be ideally exposed in the @neos-project/neos-ui-extensibility plugin config,
                // but they are herer to stay for compatibility
                {
                    test: /node_modules\/@ckeditor\/.*\.svg$/,
                    use: ['raw-loader']
                },
                {
                    test: /node_modules\/@ckeditor\/.*\.css$/,
                    use: ['null-loader']
                },
                {
                    test: /\.(woff|woff2|eot|ttf|svg)$/,
                    exclude: /node_modules\/@ckeditor.*$/,
                    use: [{
                        loader: 'url-loader',
                        options: {
                            limit: 10000,
                            name: './Styles/Font-[hash].[ext]',
                            publicPath: './../'
                        }
                    }]
                },
                {
                    test: /\.css$/,
                    exclude: [
                        /node_modules\/@ckeditor.*$/
                    ],
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                publicPath: './../'
                            }
                        },
                        {
                            loader: 'css-loader',
                            options: {
                                modules: {
                                    localIdentName: '[name]__[local]___[hash:base64:5]'
                                },
                                importLoaders: 1
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                config: {
                                    path: path.join(__dirname, 'postcss.config.js')
                                }
                            }
                        }
                    ]
                },
                {
                    test: /\.vanilla-css$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                publicPath: './../'
                            }
                        },
                        {
                            loader: 'css-loader'
                        }
                    ]
                }
            ],
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
            alias: extensibilityMap
        }
    }
};
