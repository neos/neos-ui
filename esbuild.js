const env = require('@neos-project/build-essentials/src/environment');
const stylePlugin = require('esbuild-style-plugin');

require('esbuild').build({
    entryPoints: ['./packages/neos-ui/src/index.js'],
    outfile: 'output.js',
    sourcemap: !env.isProduction,
    color: true,
    bundle: true,
    loader: {
        '.js': 'tsx',
        '.svg': 'file',
    },
    plugins: [
        stylePlugin({
            cssModulesMatch: '.css',
            postcssConfigFile: require('path').join(__dirname, 'packages/build-essentials/src/postcss.config.js')
        })
    ],
    external: [
        'ckeditor5/package.json',
        'vfile',
        'replace-ext'
    ]
})
    .then(() => console.log('⚡ Done'))
    .catch(() => process.exit(1));
