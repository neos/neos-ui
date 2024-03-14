const {sep} = require('path')
const {compileWithCssVariables} = require('./cssVariables');
const {cssModules} = require('./cssModules');
const esbuild = require('esbuild');
const { version } = require('./package.json')

const isProduction = process.argv.includes('--production');
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
                // we are currently intercepting all `/\.css/` files, as this is the most accurate way and has nearly no impact on performance
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
                targets: { // only support es2020 browser
                    // only supports browserList format
                    // https://lightningcss.dev/transpilation.html
                    // list of supported browser version per es version
                    // https://github.com/evanw/esbuild/issues/121#issuecomment-646956379
                    chrome: (80 << 16), // 80
                    safari: (13 << 16) | (1 << 8), // 13.1
                    firefox: (72 << 16), // 72
                    edge: (80 << 16) // 80
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
