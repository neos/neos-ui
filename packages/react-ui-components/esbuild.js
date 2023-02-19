const {compileWithCssVariables} = require('../../cssVariables')

const nodePath = require("path")
const { writeFile, mkdir } = require("fs/promises")

const packageJson = require("./package.json");
const { cssModules } = require('../../cssModules');

require('esbuild').build({
    entryPoints: [
        "src/index.ts",
        "src/unstyled.ts"
    ],
    external: Object.keys({...packageJson.dependencies, ...packageJson.peerDependencies}),
    outdir: "dist",
    sourcemap: "linked",
    logLevel: 'info',
    target: 'es2020',
    assetNames: './_css/[hash]',
    chunkNames: './_chunk/[hash]',
    color: true,
    bundle: true,
    splitting: true,
    format: "esm",
    loader: {
        '.js': 'tsx',
        '.svg': 'dataurl',
        '.css': 'copy'
    },
    metafile: true,
    write: false, // we dont write directly see `.then()` below
    plugins: [
        cssModules(
            {
                includeFilter: /\.css$/,
                visitor: compileWithCssVariables(),
                targets: {
                    chrome: 80 // aligns somewhat to es2020
                },
                drafts: {
                    nesting: true
                },
                cssModulesPattern: `neos-[hash]_[local]`
            }
        )
    ]
}).then((result) => {
    if (result.errors.length) {
        return;
    }

    // check for incorrect build or if we have accidentally bundled dependencies what we dont want at all ;)
    for (const path of Object.keys(result.metafile.inputs)) {
        if (path.startsWith("src/") || path.startsWith("css-modules:")) {
            continue;
        }
        throw new Error(`File ${path} doesnt belong to the currently bundled package, yet is not listed as dependeny.`)
    }

    // we regex replace unused chunk imports in the js files,
    // this fixes the suboptimal output
    // see issue https://github.com/evanw/esbuild/issues/2922

    const unusedImportsRegex = /^import ".*_chunk\/[^;]+;$/gm;
    result.outputFiles.forEach(async (file) => {
        await mkdir(nodePath.dirname(file.path), { recursive: true})

        if (file.path.endsWith(".js") && !file.path.endsWith(".map.js")) {
            const replacedUnusedImports = file.text.replace(unusedImportsRegex, "");
            writeFile(file.path, replacedUnusedImports, { encoding: "utf8" })
        } else {
            writeFile(file.path, file.contents)
        }
    })
})
