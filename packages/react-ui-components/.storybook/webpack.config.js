const path = require('path');
const brand = require('@neos-project/brand');
const brandVars = brand.generateCssVarsObject(brand.config, 'brand');

module.exports = {
    module: {
        loaders: [
            //
            // The CSS modules compliant loader.
            //
            {
                test: /\.css$/,
                loader: 'style!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader',
                include: [
                    path.resolve(__dirname, '../src/')
                ]
            },

            //
            // If you want to use the <Icon/> component, this loader is
            // required since the FA source will be included.
            //
            {
                test: /\.(woff|woff2)$/,
                loader: 'url?limit=100000'
            }
        ]
    },

    //
    // Note these plugins if you want to use webpack with to compile your application.
    //
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
                '--halfSpacing': '8px',

                //
                // Sizes
                //
                '--sidebarWidth': '320px',

                //
                // Font sizes
                //
                '--baseFontSize': '14px'
            }, brandVars)
        }),
        require('postcss-nested')(),
        require('postcss-hexrgba')()
    ]
};
