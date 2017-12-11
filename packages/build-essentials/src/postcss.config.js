const brand = require('@neos-project/brand');
const brandVars = brand.generateCssVarsObject(brand.config, 'brand');
const styles = require('./styles/styleConstants');
const styleVars = styles.generateCssVarsObject(styles.config);

module.exports = {
    plugins: [
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
                '--quarterSpacing': '4px',

                //
                // Sizes
                //
                '--sidebarWidth': '320px',

                //
                // Font sizes
                //
                '--baseFontSize': '14px',
                '--smallFontSize': '12px'
            }, styleVars, brandVars)
        }),
        require('postcss-import')(),
        require('postcss-nested')(),
        require('postcss-hexrgba')()
    ]
};
