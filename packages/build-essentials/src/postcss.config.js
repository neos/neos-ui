module.exports = {
    plugins: [
        require('postcss-import')(),
        require('postcss-nested')(),
        require('postcss-hexrgba')(),
        require('autoprefixer'),
    ]
};
