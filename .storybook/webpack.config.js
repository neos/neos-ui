const defaultConfig = require('./../webpack.config');

module.exports = Object.assign({}, defaultConfig, {
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: 'style!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader'
            }
        ]
    }
});
