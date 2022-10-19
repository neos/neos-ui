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

                // HOTFIX fixes the "global is undefined" when using react-codemirror2
                // we dont declare `global = window` as we want to control everything and notice it, when something is odd
                // this bug has been fixed and merged since to the source code of react-codemirror2,
                // but the maintainers said that they won't release it, because they are not using the project anymore.
                // see https://github.com/scniro/react-codemirror2/pull/260#issuecomment-1023202972
                // @todo use fork or dont use this abstraction at all ;)
                onLoad({filter: /\/react-codemirror2\/index.js$/}, async ({path}) => {
                    const contents = (await require('fs/promises').readFile(path)).toString();
                    const replacedGlobal = contents.replace("global['PREVENT_CODEMIRROR_RENDER'] === true", "false");
                    return {
                        contents: replacedGlobal,
                        loader: "js"
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
        // handover the NODE_ENV to the to be bundled javascript 
        // used fx. in `react-dom/profiling.js` to check if we use minfied and treeshaked code in production
        'process.env.NODE_ENV': JSON.stringify(env.isProduction ? 'production' : undefined),
    },
})
