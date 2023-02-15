const { transform } = require('lightningcss');
const { createHash } = require('crypto');
const fs = require("fs/promises");
const { dirname } = require("path");

/**
 * A generic cssModules plugin for esbuild based on lightningcss
 * 
 * @param {Object} options
 * @param {RegExp} options.includeFilter
 * @param {RegExp} options.excludeFilter
 * @param {import("lightningcss").TransformOptions["visitor"]} options.visitor
 * @param {import("lightningcss").TransformOptions["targets"]} options.targets
 * @param {import("lightningcss").TransformOptions["drafts"]} options.drafts
 * @return {import("esbuild").Plugin}
 */
const cssModules = (options) => {
    return {
        name: "css-modules",
        setup: ({onLoad, onResolve, initialOptions}) => {
            const transpiledCssModulesMap = new Map()

            onResolve({filter: /^css-modules:\/\//}, ({path}) => {
                return {
                    namespace: "css-modules",
                    path,
                }
            })

            onLoad({filter: /.*/, namespace: "css-modules"}, ({path}) => {
                const {code, resolveDir} = transpiledCssModulesMap.get(path)
                return {
                    contents: code,
                    loader: initialOptions.loader?.[".css"] ?? "css",
                    resolveDir,

                }
            })

            onLoad({filter: options.includeFilter ?? /\.module\.css$/}, async ({path}) => {
                if (options.excludeFilter && options.excludeFilter.test(path)) {
                    return;
                }
     
                // @todo cache it...

                const rawCssBuffer = await fs.readFile(path)

                const { code, map, exports } = transform({
                    filename: path,
                    code: rawCssBuffer,
                    analyzeDependencies: false,
                    cssModules: true,
                    sourceMap: true,
                    targets: options.targets,
                    drafts: options.drafts,
                    visitor: options.visitor
                });

                if (!exports) {
                    return;
                }

                const id = "css-modules:\/\/" + createHash("sha256").update(path).digest('base64url') + '.css'

                const finalcode = code.toString("utf8") + `/*# sourceMappingURL=data:text/plain;base64,${map.toString("base64")} */`;

                transpiledCssModulesMap.set(
                    id,
                    { code: finalcode, resolveDir: dirname(path) }
                )

                let jsHead = "";

                let jsBody = `import "${id}" \nexport default {`;
                
                let dependencyCount = 0;

                for (const [cssClassReadableName, cssClassExport] of Object.entries(exports)) {

                    let compiledCssClasses = `"${cssClassExport.name}`

                    if (cssClassExport.composes) {
                        for (const composition of cssClassExport.composes) {
                            switch (composition.type) {
                                case "local":
                                    compiledCssClasses += " " + composition.name
                                    break;
                            
                                case "global":
                                    compiledCssClasses += " " + composition.name
                                    break;

                                case "dependency":
                                    jsHead += `import dependency_${dependencyCount} from ${JSON.stringify(composition.specifier)}\n`
                                    compiledCssClasses += ` " + dependency_${dependencyCount}["${composition.name}"] + "`
                                    
                                    dependencyCount ++
                                    break;
                            }
                        }
                    }

                    compiledCssClasses += `"`

                    jsBody += `"${cssClassReadableName}":${compiledCssClasses},`
                }

                jsBody += "}"

                return {
                    contents: jsHead + jsBody,
                    loader: "js",
                }
            })
        }    
    }
}

module.exports = { cssModules }
