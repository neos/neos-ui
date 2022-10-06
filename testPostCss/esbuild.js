const env = require('@neos-project/build-essentials/src/environment');
const stylePlugin = require('esbuild-style-plugin');


console.log(require('path').join(__dirname, '../packages/build-essentials/src/postcss.config.js'))


require('esbuild').build({
    entryPoints: ['./index.js'],
    outdir: './dist',
    sourcemap: !env.isProduction,
    color: true,
    bundle: true,
    plugins: [
        stylePlugin({
            cssModulesMatch: '.css',
            postcssConfigFile: require('path').join(__dirname, '../packages/build-essentials/src/postcss.config.js')
        })
    ],
    logLevel: "verbose"
})
