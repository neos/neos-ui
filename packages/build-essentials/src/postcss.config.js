module.exports = {
    plugins: [
        require('postcss-nested')(),
        require('postcss-import')(),
        require('postcss-hexrgba')(),
        require('autoprefixer')(),
    ]
};
