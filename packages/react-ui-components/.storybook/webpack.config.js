const sharedWebPackConfig = require('@neos-project/build-essentials/src/webpack.config.js');
module.exports = {
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                loader: 'babel'
            },
            {
                test: /\.json$/,
                exclude: /(node_modules)/,
                loader: 'json-loader'
            },
            {
                test: /\.(woff|woff2)$/,
                loader: 'url?limit=100000'
            },
            {
                test: /\.css$/,
                loader: 'style!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader'
            }
        ]
    },
    postcss: sharedWebPackConfig.postcss
};
