// thank you hannoeru/jest-esbuild !!! :D
// copied and adjusted from https://github.com/hannoeru/jest-esbuild/blob/f65ca935e335192cfbf4324ebfde42197193a68d/src/index.ts

// jest mocking doesnt work, but we dont need it anyway

const { extname } = require("path");
const { createHash } = require("crypto");
const { transformSync } = require("esbuild");
const { readFileSync } = require("fs");

/** @param {String} path */
function isTarget(path) {
    return (
        path.endsWith(".js") ||
        path.endsWith(".jsx") ||
        path.endsWith(".ts") ||
        path.endsWith(".tsx")
    );
}

// for cache invalidation if you change this file ;)
// you can clear the jest cache also by running `yarn jest --clearCache`
const thisFileRaw = readFileSync(__filename)

const tsconfigRaw = readFileSync("../tsconfig.json", "utf8");

const createTransformer = () => {
    /** @type {import("esbuild").TransformOptions} */
    const options = {
        format: "cjs",
        target: "node16",
        sourcemap: true,
        keepNames: true,
        // make sure to use the same tsconfig as the project to for example add the "use strict" flag
        tsconfigRaw,
    };

    return {
        canInstrument: true,
        getCacheKey(fileData, filePath) {
            return createHash("md5")
                .update(thisFileRaw)
                .update('\0', 'utf8')
                .update(fileData)
                .update("\0", "utf8")
                .update(filePath)
                .update("\0", "utf8")
                .update(process.env.NODE_ENV || "")
                .digest("hex");
        },
        process(source, path) {
            if (!isTarget(path)) {
                return {
                    code: source,
                };
            }

            const extension = extname(path).slice(1);

            const result = transformSync(source, {
                loader: extension === "js" ? "tsx" : extension,
                ...options,
            });


            if (result.code.includes("ichBinDasIcon")) {
              console.log({path});
                console.log(result.code);
            }

            if (result.warnings.length) {
                result.warnings.forEach((m) => {
                    // eslint-disable-next-line no-console
                    console.warn(m);
                });
            }

            return {
                code: result.code,
                map: result.map,
            };
        },
    };
};

module.exports = { createTransformer };
