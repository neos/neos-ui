const {sep} = require('path')

const esbuild = require('esbuild');

const isWatch = process.argv.includes("--watch");

/** @type {import("esbuild").BuildOptions} */
const options = {
    entryPoints: ['./index.js'],
    absWorkingDir: __dirname,
    outdir: './dist',
    sourcemap: true,
    minify: false,
    logLevel: 'info',
    target: 'es2020',
    color: true,
    bundle: true,
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
            }
        }
    ],
}

if (isWatch) {
    esbuild.context(options).then((ctx) => ctx.watch())
} else {
    esbuild.build(options)
}
