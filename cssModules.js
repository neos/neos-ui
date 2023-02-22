const { transform } = require('lightningcss');
const { createHash } = require('crypto');
const fs = require("fs/promises");
const { dirname, join } = require("path");

/**
 * A generic cssModules plugin for esbuild based on lightningcss
 * 
 * @param {Object} options
 * @param {RegExp} options.includeFilter
 * @param {RegExp} options.excludeFilter
 * @param {import("lightningcss").TransformOptions["visitor"]} options.visitor
 * @param {import("lightningcss").TransformOptions["targets"]} options.targets
 * @param {import("lightningcss").TransformOptions["drafts"]} options.drafts
 * @param {import("lightningcss").CSSModulesConfig["pattern"]} options.cssModulesPattern
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

                const rawCssBuffer = await fs.readFile(path)

                const { code, map, exports } = transform({
                    filename: path,
                    code: rawCssBuffer,
                    analyzeDependencies: false,
                    cssModules: {
                        pattern: options.cssModulesPattern ?? `[hash]_[local]`
                    },
                    sourceMap: true,
                    targets: options.targets,
                    drafts: options.drafts,
                    visitor: options.visitor,
                    // this way the correct relative path for the source map will be generated ;)
                    projectRoot: join(initialOptions.absWorkingDir || process.cwd(), initialOptions.outdir)
                });

                if (!exports) {
                    return;
                }

                const id = "css-modules:\/\/" + createHash("sha256").update(path).digest('base64url') + '.css'

                const finalcode = code.toString("utf8") + `/*# sourceMappingURL=data:application/json;base64,${map.toString("base64")} */`;

                transpiledCssModulesMap.set(
                    id,
                    { code: finalcode, resolveDir: dirname(path) }
                )

                const quote = JSON.stringify;

                const escape = (string) => JSON.stringify(string).slice(1, -1)

                let contents = "";

                /** @type {Map<string, string>} */
                const dependencies = new Map()

                /** @param {String} path */
                const importDependeny = (path) => {
                    if (dependencies.has(path)) {
                        return dependencies.get(path)
                    }
                    const dependenciesName = `dependency_${dependencies.size}`
                    // prepend dependeny to to the contents
                    contents = `import ${dependenciesName} from ${quote(path)}\n` + contents;
                    dependencies.set(path, dependenciesName)
                    return dependenciesName;
                }

                contents += `import ${quote(id)}\n`;
                contents += `export default {`;

                for (const [cssClassReadableName, cssClassExport] of Object.entries(exports)) {

                    let compiledCssClasses = `"${escape(cssClassExport.name)}`

                    if (cssClassExport.composes) {
                        for (const composition of cssClassExport.composes) {
                            switch (composition.type) {
                                case "local":
                                    compiledCssClasses += " " + escape(composition.name)
                                    break;
                            
                                case "global":
                                    compiledCssClasses += " " + escape(composition.name)
                                    break;

                                case "dependency":
                                    compiledCssClasses += ` " + ${importDependeny(composition.specifier)}[${quote(composition.name)}] + "`
                                    break;
                            }
                        }
                    }

                    compiledCssClasses += `"`

                    contents += `${quote(cssClassReadableName)}:${compiledCssClasses},`
                }

                contents += "}"

                // https://github.com/evanw/esbuild/issues/2943#issuecomment-1439755408
                const emptyishSourceMap = "data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIiJdLCJtYXBwaW5ncyI6IkEifQ==";
                contents += `\n//# sourceMappingURL=${emptyishSourceMap}`

                return {
                    contents,
                    loader: "js",
                }
            })
        }    
    }
}

module.exports = { cssModules }
