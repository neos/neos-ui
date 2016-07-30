const {
    baseConfig,
    hostConfig
} = require('./../webpack.base.config');

module.exports = Object.assign({}, baseConfig, hostConfig, {
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: 'style!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader'
            },
            {
                test: /\.(png|woff|woff2|eot|ttf|svg)$/,
                loader: 'url-loader?limit=100000'
            }
        ]
    }
});
