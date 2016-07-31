const path = require('path');
const brand = require('@neos-project/brand');
const brandVars = brand.generateCssVarsObject(brand.config, 'brand');

module.exports = {
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: 'style!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader',
                include: [
                    path.resolve(__dirname, '../src/'),
                    path.resolve(__dirname, '../node_modules/font-awesome/')
                ]
            },
            {
                test: /\.(woff|woff2)$/,
                loader: 'url?limit=100000'
            }
        ]
    },

    postcss: [
        require('autoprefixer')({
            browsers: ['last 2 versions']
        }),
        require('postcss-css-variables')({
            variables: Object.assign({
                //
                // Spacings
                //
                '--goldenUnit': '40px',
                '--spacing': '16px',

                //
                // Sizes
                //
                '--sidebarWidth': '320px'
            }, brandVars)
        }),
        require('postcss-import')(),
        require('postcss-nested')(),
        require('postcss-hexrgba')()
    ]
};
