const path = require('path');

module.exports = {
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: [{
                    loader: 'babel-loader'
                }]
            },
            {
                test: /\.json$/,
                exclude: /(node_modules)/,
                use: [{
                    loader: 'json-loader'
                }]
            },
            {
                test: /\.(png|woff|woff2|eot|ttf|svg)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 10000
                    }
                }]
            },
            {
                test: /\.css$/,
                use: [{
                    loader: 'style-loader'
                }, {
                    loader: 'css-loader',
                    options: {
                        modules: true,
                        importLoaders: 1,
                        localIdentName: '[name]__[local]___[hash:base64:5]'
                    }
                }, {
                    loader: 'postcss-loader',
                    options: {
                        config: {
                            path: path.join(__dirname, '..', 'node_modules', '@neos-project/build-essentials/src/postcss.config.js')
                        }
                    }
                }]
            }
        ]
    }
};
