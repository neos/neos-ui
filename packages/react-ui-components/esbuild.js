const { compileWithCssVariables } = require('../../cssVariables')

const nodePath = require("path")
const { writeFile, mkdir } = require("fs/promises")

const { cssModules } = require('../../cssModules');
const { build } = require('esbuild');

const { readdirSync } = require("fs")

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
 * please dont remove this check!
 * when building the dist we rely that our source code uses no file extensions when referencing relative js sources
 * it ensures our dist build still works eventhough we export `.js` instead of `.ts` (currently there is no import rewrite)
 * this check acts as a safe guard to test against malformed imports
 * in case you want to import a library with specified extension, just exclude the path from the check below, as this is ok ;)
 * 
 * @param {string} importPath
 */
function assertImportPathsSpecifiedWithoutExtension(importPath) {
    if (importPath.match(/\.(jsx?|tsx?)$/)) {
        throw new Error(`NeosBuildCheck: Import ${importPath} probably malformed as it ends with a javascript extension.`)
    }
}

async function main() {

    /**
     * we select all ts,js files that are not tests
     * this logic should always align to the include and exclude patterns in `tsconfig.esmtypes.json`
     */
    const entryPoints = [...walkSync(nodePath.join(__dirname, "src"))].filter((file) => {
        if (/(\.spec\.[^/]+|\.story\.jsx?|\.d\.ts)$/.test(file)) {
            return false;
        }
        if (/(\.tsx?|\.jsx?)$/.test(file)) {
            return true;
        }
        return false;
    })

    console.time("Build")

    const buildResultsPromise = entryPoints.map((entryPoint) => build({
        entryPoints: [entryPoint],
        outbase: "src",
        outdir: "dist",
        sourcemap: "linked",
        bundle: true,
        logLevel: 'silent',
        target: 'es2020',
        assetNames: './_css/[hash]',
        color: true,
        format: "esm",
        write: false,
        metafile: true,
        loader: {
            '.js': 'tsx',
            '.svg': 'dataurl',
            '.css': 'copy'
        },
        plugins: [
            {
                name: "bundel-only-ressources-for-each-entry",
                setup: ({onResolve}) => {
                    onResolve({filter: /.*/}, ({path}) => {
                        if (path.endsWith(".css") || path.endsWith(".svg")) {
                            return;
                        }

                        if (path === entryPoint) {
                            return;
                        }

                        return {
                            external: true
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
                    },
                    cssModulesPattern: `neos-[hash]_[local]`
                }
            )
        ]
    }))

    const buildResults = await Promise.all(buildResultsPromise)
    const writtenFiles = new Set();
    for (const buildResult of buildResults) {

        for (const inputImport of Object.values(buildResult.metafile.inputs).flatMap(input => input.imports)) {
            assertImportPathsSpecifiedWithoutExtension(inputImport.path)
        }

        for (const file of buildResult.outputFiles) {
            if (writtenFiles.has(file.path)) {
                continue;
            }
            writtenFiles.add(file.path);
            await mkdir(nodePath.dirname(file.path), { recursive: true })
            writeFile(file.path, file.contents);
        }
    }

    console.timeEnd("Build")
    console.log(`Wrote ${writtenFiles.size} files.`);
}

main();
