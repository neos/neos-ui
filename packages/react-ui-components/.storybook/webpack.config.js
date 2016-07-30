const autoprefixer = require('autoprefixer');
const vars = require('postcss-simple-vars');
const hexToRgba = require('postcss-hexrgba');
const postCssImport = require('postcss-import');
const nested = require('postcss-nested');
const path = require('path');

module.exports = {
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: 'style!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader',
                include: path.resolve(__dirname, '../src/')
            }
        ]
    },

    postcss: [
        autoprefixer({
            browsers: ['last 2 versions']
        }),
        vars({
            variables: {
                //
                // Colors
                //
                darkest: '#141414',
                darker: '#222',
                dark: '#3f3f3f',
                neutral: '#323232',
                bright: '#999',
                brighter: '#adadad',
                brightest: '#FFF',
                brand: '#00b5ff',
                success: '#00a338',
                warn: '#ff8700',
                error: '#ff460d',

                //
                // Spacings
                //
                spacing: '16px',
                halfSpacing: '8px',
                unit: '40px',
                quarterSpacing: '4px',

                // Sizes
                sidebarWidth: '320px'
            }
        }),
        postCssImport(),
        nested(),
        hexToRgba()
    ]
};
