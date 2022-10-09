const env = require('@neos-project/build-essentials/src/environment');
const stylePlugin = require('esbuild-style-plugin');
const {sep} = require("path")

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
            setup: ({onResolve, onLoad, resolve}) => {
                // HOTFIX: Some packages require "path" (require('path'))
                //         We mock this module here return the content of `mockPath.js`.
                onResolve({filter: /^path$/}, () => ({
                    path: require('path').join(__dirname, 'mockPath.js'),
                }))

                // exclude CKEditor styles
                // the filter must match the import statement - and as one usually uses relative paths we cannot look for `@ckeditor` here
                // the most correct way would be to look for all `/\.css/` - but this draws performance as we would intercept each css file
                // so we use the the longest/most expressive regex that tries to match all ckeditor includes
                // and luckely all includes look like `../theme/link.css` so we use the theme prefix `/theme\/[^.]+\.css$/`
                // @todo i cant measure any time differences ... so using .css
                onResolve({filter: /\.css$/, namespace: "file"}, ({path, ...options}) => {
                    if (!options.importer.includes(`${sep}@ckeditor${sep}`)) {
                        return resolve(path, {...options, namespace: "noRecurse"})
                    }
                    return {
                        external: true, 
                        sideEffects: false
                    }
                })

                // load ckeditor icons as plain text and not via `.svg: dataurl`
                // (currently neccessary for the table select handle icon)
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
            cssModulesMatch: /^((?!\/@ckeditor|\/@fortawesome\/fontawesome-svg-core)).*\.s?css$/,
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
