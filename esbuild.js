const {sep} = require('path')
const {compileWithCssVariables} = require('./cssVariables');
const {cssModules} = require('./cssModules');
const esbuild = require('esbuild');
const { version } = require('./package.json')

const isProduction = process.env.NODE_ENV === 'production' || process.argv.includes('--production');
const isE2ETesting = process.argv.includes('--e2e-testing');
const isWatch = process.argv.includes('--watch');
const isAnalyze = process.argv.includes('--analyze');

if (isE2ETesting) {
    console.log('Building for E2E testing');
}

/** @type {import("esbuild").BuildOptions} */
const options = {
    entryPoints: {
        'Host': './packages/neos-ui/src/index.js',
        'HostOnlyStyles': './packages/neos-ui/src/styleHostOnly.css'
    },
    outdir: './Resources/Public/Build',
    sourcemap: true,
    minify: isProduction,
    logLevel: 'info',
    target: 'es2020',
    color: true,
    bundle: true,
    keepNames: isE2ETesting, // for react magic selectors,
    metafile: isAnalyze,
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
        cssModules(
            {
                visitor: compileWithCssVariables(),
                targets: {
                    chrome: 80 // aligns somewhat to es2020
                },
                drafts: {
                    nesting: true
                }
            }
        )
    ],
    define: {
        // we dont declare `global = window` as we want to control everything and notice it, when something is odd
        NEOS_UI_VERSION: JSON.stringify(isProduction ? `v${version}` : `v${version}-dev`)
    }
}

if (isWatch) {
    esbuild.context(options).then((ctx) => ctx.watch())
} else {
    esbuild.build(options).then(result => {
        if (isAnalyze) {
            require("fs").writeFileSync('meta.json', JSON.stringify(result.metafile))
            console.log("\nUpload './meta.json' to https://esbuild.github.io/analyze/ to analyze the bundle.")
        }
    })
}
