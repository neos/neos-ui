const {compileWithCssVariables} = require('../../cssVariables')

const nodePath = require("path")
const { readdirSync } = require("fs")
const { writeFile, mkdir } = require("fs/promises")

const packageJson = require("./package.json");
const { cssModules } = require('../../cssModules');

/**
 * @param {String} dir
 * @returns {Generator<String>}
 */
function *walkSync(dir) {
    const files = readdirSync(dir, { withFileTypes: true });
    for (const file of files) {
        if (file.isDirectory()) {
            yield* walkSync(nodePath.join(dir, file.name));
        } else {
            yield nodePath.join(dir, file.name);
        }
    }
}

/**
 * we select all ts,js files that are not tests
 * this logic should always align to the include and exclude patterns in `tsconfig.esmtypes.json`
 */
const files = [...walkSync(nodePath.join(__dirname, "src"))].filter((file) => {
    if (/(\.spec\.tsx?|\.spec\.jsx?|\.story\.jsx?|\.d\.ts)$/.test(file)) {
        return false;
    }
    if (/(\.tsx?|\.jsx?)$/.test(file)) {
        return true;
    }
    return false;
})

require('esbuild').build({
    entryPoints: files,
    external: Object.keys({...packageJson.dependencies, ...packageJson.peerDependencies}),
    outdir: "lib-esm",
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
    write: false, // we dont write directly see `.then()` below
    plugins: [
        {
            name: "check-for-incorrect-build",
            setup: ({onResolve, resolve}) => {
                onResolve({ filter: /.*/, namespace: "file" }, async ({ path, ...options }) => {
                    const result = await resolve(path, { ...options, namespace: "noRecurse"})
                    if (result.path.includes(__dirname) || result.path.startsWith("css-modules://")) {
                        return result;
                    }
                    if (result.external === false) {
                        throw new Error(`File ${result.path} doesnt belong to the currently bundled package, yet is not listed as dependeny.`, )
                    }
                    return result;
                  })
            }
        },
        cssModules(
            {
                includeFilter: /\.css$/,
                visitor: compileWithCssVariables(),
                targets: {
                    chrome: 80 // aligns somewhat to es2020
                },
                drafts: {
                    nesting: true
                }
            }
        )
    ]
}).then((result) => {
    if (result.errors.length) {
        return;
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
