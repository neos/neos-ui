const env = require('@neos-project/build-essentials/src/environment');
const stylePlugin = require('esbuild-style-plugin');

require('esbuild').build({
    entryPoints: {
        'Host': './packages/neos-ui/src/index.js',
        'HostOnlyStyles': './packages/neos-ui/src/styleHostOnly.css'
    },
    outdir: './Resources/Public',
    sourcemap: !env.isProduction,
    minify: env.isProduction,
    logLevel: env.isProduction ? 'error' : undefined,
    color: true,
    bundle: true,
    loader: {
        '.js': 'tsx',
        '.svg': 'dataurl',
        '.vanilla-css': 'css',
        '.ttf': 'file',
    },
    plugins: [
        {
            name: 'neos-ui-build',
            setup: ({onResolve, onLoad}) => {
                // HOTFIX: Some packages require "path" (require('path'))
                //         We mock this module here return the content of `mockPath.js`.
                onResolve({filter: /^path$/}, () => ({
                    path: require('path').join(__dirname, 'mockPath.js'),
                }))

                // exclude CKEditor styles
                onLoad({filter: /node_modules\/@ckeditor\/.*\.css$/}, () => ({
                    contents: '',
                    loader: 'css'
                }))

                onLoad({filter: /node_modules\/@ckeditor\/.*\.svg$/}, async ({path}) => ({
                    contents: (await require('fs/promises').readFile(path)).toString(),
                    loader: 'text'
                }))

                // prefix Fontawesome with "neos-" to prevent clashes with customer Fontawesome
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
            // process all .css and .scss files
            // but exclude those files that are in the dir
            // - @ckeditor
            // - @fortawesome/fontawesome-svg-core
            cssModulesMatch: /^((?!\/@ckeditor|\/@fortawesome\/fontawesome-svg-core).)*\.s?css$/,
            postcss: {
                plugins: [
                    require('postcss-import'),
                    require('postcss-nested'),
                    require('postcss-hexrgba'),
                    require('autoprefixer'),
                ]
            }
        }),
    ],
    define: {
        // put process env NODE_ENV into global scope as some packages need it (nodeJS)
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        // put 'global' as empty object into glonal scope as some packages need it (nodeJS)
        'global': '{}'
    },
})
