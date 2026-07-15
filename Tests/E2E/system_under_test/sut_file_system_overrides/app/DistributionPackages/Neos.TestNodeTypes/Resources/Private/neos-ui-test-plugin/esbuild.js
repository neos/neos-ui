const esbuild = require('esbuild');
const extensibilityMap = require('@neos-project/neos-ui-extensibility/extensibilityMap.json');

/** @type {import('esbuild').BuildOptions} */
const options = {
    logLevel: 'info',
    bundle: true,
    metafile: true,
    target: 'es2020',
    entryPoints: { 'Plugin': 'src/index.ts' },
    outdir: '../../Public/JavaScript',
    alias: {
        ...extensibilityMap,
        // ensure we use the published api of the extensibility like we would when this is published to NMP
        '@neos-project/neos-ui-extensibility': '@neos-project/neos-ui-extensibility/plugin-api.js'
    }
}

esbuild.build(options).then(result => {
    //
    // sanity check - part of the e2e test
    //
    // As we use the same node_modules installation as the neos-ui build we could incorrectly end up bundling
    // a package instead of using the extensibility API correctly. -> In some cases this might even work at runtime.
    //
    // Though to ensure this never happens we analyse the output and ensure that only files from expected locations are bundled.
    //
    //
    for (const [inputPath, inputMetaData] of Object.entries(result.metafile.inputs)) {
        if (inputPath.startsWith('src/')) {
            // code from this very plugin
            continue;
        }
        if (inputPath.includes('/packages/neos-ui-extensibility/dist/')) {
            // the extensibility accessors to stubs
            continue;
        }
        if (inputPath.endsWith('/packages/neos-ui-extensibility/plugin-api.js')) {
            // the extensibility api
            continue;
        }
        throw new Error(`Invalid input ${inputPath} (${JSON.stringify(inputMetaData)}), only src files and 'neos-ui-extensibility' must be bundled!`);
    }
});
