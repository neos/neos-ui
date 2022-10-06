
// TODO: remove
module.exports = {
    plugins: [
        require('postcss-nested')(),
        require('postcss-extend')(),
        require('postcss-import')(),
        require('postcss-hexrgba')(),
        require('autoprefixer')(),
    ]
};
