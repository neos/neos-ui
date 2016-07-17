import load from 'Shared/Utilities/LoadScript';

//
// A simple registry for inspector editors
//
export default (moduleMapping, legacyMapping = {}) => {
    const loadedInlineEditorsByModuleName = {};
    const loadedInlineEditorsByLegacyName = {};
    const deferred = {};

    return {
        //
        // Register a new inspector editor
        //
        register: (moduleName, legacyName, factory) => {
            //
            // Support omitting the legacy name
            //
            if (typeof legacyName === 'string') {
                loadedInlineEditorsByLegacyName[legacyName] = factory;
            } else {
                factory = legacyName;
            }

            loadedInlineEditorsByModuleName[moduleName] = factory;

            //
            // Look for already pending promises for this editor and
            // resolve them right away
            //
            if (deferred[moduleName] !== undefined) {
                deferred[moduleName].forEach(resolve => resolve(factory));
                deferred[moduleName] = undefined;
            }

            //
            // Repeat that for legacy editor identifiers as well
            //
            if (typeof legacyName === 'string' && deferred[legacyName] !== undefined) {
                deferred[legacyName].forEach(resolve => resolve(factory));
                deferred[legacyName] = undefined;
            }
        },
        get: moduleName => {
            //
            // Check if the editor is known to the system
            //
            if (moduleMapping[moduleName] === undefined && legacyMapping[moduleName] === undefined) {
                console.warn('Host frame is asking for an unknown inspector editor.');
                console.warn(`Cannot find: ${moduleName}. Do you have it correctly configured in your Settings.yaml?`);
            } else {
                //
                // Display a deprecation warning at this point, that instructs the developer to
                // migrate to the new identifier convention for UI extensions
                //
                if (moduleMapping[moduleName] === undefined && legacyMapping[moduleName] !== undefined) {
                    console.warn(`${moduleName} is a deprecated editor identifier. Make sure to change it to ${legacyMapping[moduleName].migratesTo}.`);
                }

                //
                // Now load the script that contains the requested editor
                //
                load(moduleMapping[moduleName] || legacyMapping[moduleName].target);
            }

            return new Promise(resolve => {
                //
                // Resolve the promise right away, if the editor is loaded already
                //
                if (loadedInlineEditorsByModuleName[moduleName] !== undefined) {
                    resolve(loadedInlineEditorsByModuleName[moduleName]);
                }

                //
                // Repeat that for legacy editor identifiers as well
                //
                if (loadedInlineEditorsByLegacyName[moduleName] !== undefined) {
                    resolve(loadedInlineEditorsByLegacyName[moduleName]);
                }

                //
                // If the editor is not loaded yet, remember this promise, so that it
                // can be resolved as soon as the editor got registered
                //
                if (deferred[moduleName] === undefined) {
                    deferred[moduleName] = [];
                }

                deferred[moduleName].push(resolve);
            });
        }
    };
};
