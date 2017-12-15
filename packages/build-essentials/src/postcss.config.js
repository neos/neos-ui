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
