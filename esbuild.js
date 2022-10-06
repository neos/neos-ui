const env = require('@neos-project/build-essentials/src/environment');
const stylePlugin = require('esbuild-style-plugin');

require('esbuild').build({
    entryPoints: {
        'Host': './packages/neos-ui/src/index.js',
        'HostOnlyStyles': './packages/neos-ui/src/styleHostOnly.css'
    },
    outdir: './Resources/Public',
    sourcemap: !env.isProduction,
    color: true,
    bundle: true,
    // minify: true,
    loader: {
        '.js': 'tsx',
        '.svg': 'dataurl',

        '.ttf': "file"
    },
    plugins: [
        {
            name: 'neos-ui-build',
            // HOTFIX: Some packages require "path" (require('path'))
            //         We mock this module here return the content of `mockPath.js`.
            setup: ({onResolve, onLoad}) => {
                onResolve({filter: /^path$/}, () => ({
                    path: require('path').join(__dirname, 'mockPath.js'),
                }))

                onLoad({filter: /@fortawesome\/fontawesome-svg-core\/styles\.css$/}, async ({path}) => {
                    const contents = (await require('fs/promises').readFile(path)).toString();

                    const replacedStyle = contents.replace(/svg-inline--fa/g, "neos-svg-inline--fa");

                    return {
                        contents: replacedStyle,
                        loader: "css"
                    }
                })
            },
        },
        stylePlugin({
            cssModulesMatch: '.css',
            postcssConfigFile: require('path').join(__dirname, 'packages/build-essentials/src/postcss.config.js')
        }),
        
    ],
    define: {
        // put process env NODE_ENV into global scope as some packages need it (nodeJS)
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        // put 'global' as empty object into glonal scope as some packages need it (nodeJS)
        'global': '{}'
    },
})
