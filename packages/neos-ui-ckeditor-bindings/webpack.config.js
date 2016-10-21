const commonWebPackConfig = require('@neos-project/build-essentials/src/webpack.config');

module.exports = Object.assign({}, commonWebPackConfig, {
    entry: {
        Guest: './src/index.js'
    }
});
