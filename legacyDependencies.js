
//
// This is a workaround since yarns package.json`s publishConfig doesnt support "dependencies" (and this is fine btw)
// I just find it odd in this super modern build stack to still have webpack and babel laying around, so you now can modifiy the package json like this:
// 
// "neosPublishConfig": {
//     "legacyDependencies": {
//       "webpack": "^4.41.5"
//     }
// }
//
// webpack will only be a "real" dependency once this package is published.
//
// NOTE: This is an optional hack - if it ever stops working, just remove this plugin and revert the package.json to normal dependencies
//
// yarn is fun :D
//

module.exports = {
    name: `legacyDependencies`,
    factory: require => {
        /**
         * Called before a workspace is packed. The `rawManifest` value passed in
         * parameter is allowed to be mutated at will, with the changes being only
         * applied to the packed manifest (the original one won't be mutated).
         * 
         * @api
         * @see https://yarnpkg.com/advanced/plugin-tutorial#hook-beforeWorkspacePacking
         * @see https://github.com/yarnpkg/berry/blob/fb77381410b795893d25321583bf9a6d25a758f0/packages/plugin-pack/sources/index.ts#L16
         * 
         * @param {*} workspace 
         * @param {object} rawManifest
         * @returns {Promise<void> | void}
         */
        const beforeWorkspacePacking = (workspace, rawManifest) => {
            if (rawManifest.neosPublishConfig && rawManifest.neosPublishConfig.legacyDependencies) {
                rawManifest.dependencies = {...rawManifest.dependencies, ...rawManifest.neosPublishConfig.legacyDependencies}

                delete rawManifest.neosPublishConfig
            }
        }
        
        return {
            hooks: {
                // https://github.com/yarnpkg/berry/blob/fb77381410b795893d25321583bf9a6d25a758f0/packages/plugin-pack/sources/index.ts#L16
                beforeWorkspacePacking
            }
        }
    }
};
