const styles = require('./styles/styleConstants');
const styleVars = styles.generateCssVarsObject(styles.config);

module.exports = {
    plugins: [
        require('autoprefixer'),
        require('postcss-css-variables')({
            variables: Object.assign(styleVars)
        }),
        require('postcss-import')(),
        require('postcss-nested')(),
        require('postcss-hexrgba')()
    ]
};
