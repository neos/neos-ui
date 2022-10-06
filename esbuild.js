const env = require('@neos-project/build-essentials/src/environment');
const stylePlugin = require('esbuild-style-plugin');

require('esbuild').build({
    entryPoints: ['./packages/neos-ui/src/index.js'],
    outdir: './Resources/Public/',
    sourcemap: !env.isProduction,
    color: true,
    bundle: true,
    loader: {
        '.js': 'tsx',
        '.svg': 'text'
    },
    plugins: [
        stylePlugin({
            cssModulesMatch: '.css',
            postcssConfigFile: require('path').join(__dirname, 'packages/build-essentials/src/postcss.config.js')
        }),
        {
            name: 'neos-ui-build',
            // HOTFIX: Some packages require "path" (require('path'))
            //         We mock this module here return the content of `mockPath.js`.
            setup: ({onResolve}) => {
                onResolve({filter: /^path$/}, () => ({
                    path: require('path').join(__dirname, 'mockPath.js'),
                }))
            }
        }
    ],
    define: {
        // put process env NODE_ENV into global scope as some packages need it (nodeJS)
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        // put 'global' as empty object into glonal scope as some packages need it (nodeJS)
        'global': '{}'
    },
})
