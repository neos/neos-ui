const env = require('@neos-project/build-essentials/src/environment');
const stylePlugin = require('esbuild-style-plugin');
const {sep, join} = require('path')

const cssVariables = require('@neos-project/build-essentials/src/styles/styleConstants');
const cssVariablesObject = cssVariables.generateCssVarsObject(cssVariables.config);

const isE2ETesting = process.argv.includes('--e2e-testing');
const isWatch = process.argv.includes('--watch');

if (isE2ETesting) {
    console.log('Building for E2E testing');
}

require('esbuild').build({
    entryPoints: {
        'Host': './packages/neos-ui/src/index.js',
        'HostOnlyStyles': './packages/neos-ui/src/styleHostOnly.css'
    },
    outdir: join(env.rootPath, './Resources/Public/Build'),
    sourcemap: true,
    minify: env.isProduction,
    logLevel: 'info',
    target: 'es2020',
    color: true,
    bundle: true,
    keepNames: isE2ETesting, // for react magic selectors,
    watch: isWatch,
    legalComments: "linked",
    loader: {
        '.js': 'tsx',
        '.svg': 'dataurl',
        '.vanilla-css': 'css',
        '.woff2': 'file'
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
                onResolve({filter: /\.css$/, namespace: 'file'}, ({path, ...options}) => {
                    if (!options.importer.includes(`${sep}@ckeditor${sep}`)) {
                        return resolve(path, {...options, namespace: 'noRecurse'})
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

                    const replacedStyle = contents.replace(/svg-inline--fa/g, 'neos-svg-inline--fa');

                    return {
                        contents: replacedStyle,
                        loader: 'css'
                    }
                })
            }
        },
        stylePlugin({
            // process all .css and .scss files
            // but exclude those files that start with
            // - @ckeditor/
            // - @fortawesome/fontawesome-svg-core/
            cssModulesMatch: /^(?!@ckeditor\/|@fortawesome\/fontawesome-svg-core\/).*\.s?css$/,
            postcss: {
                plugins: [
                    require('postcss-nested'),
                    require('postcss-css-variables')({
                        variables: cssVariablesObject
                    }),
                    require('autoprefixer')
                ]
            }
        })
    ],
    define: {
        // we dont declare `global = window` as we want to control everything and notice it, when something is odd
    }
})
