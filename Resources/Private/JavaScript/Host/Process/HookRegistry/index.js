import {logger, loadScript} from 'Shared/Utilities/';

//
// A simple registry for system hooks
//
export default (moduleMapping) => {
    const loadedInlineEditorsByModuleName = {};
    const deferred = {};

    return {
        //
        // Register a new inspector editor
        //
        register: (moduleName, factory) => {
            loadedInlineEditorsByModuleName[moduleName] = factory;

            //
            // Look for already pending promises for this editor and
            // resolve them right away
            //
            if (deferred[moduleName] !== undefined) {
                deferred[moduleName].forEach(resolve => resolve(factory));
                deferred[moduleName] = undefined;
            }
        },
        get: moduleName => {
            //
            // Check if the editor is known to the system
            //
            if (moduleMapping[moduleName] === undefined) {
                logger.warn(`Host frame is asking for an unknown hook. Cannot find: "${moduleName}". Is it correctly configured in your Settings.yaml?`);
            } else {
                //
                // Now load the script that contains the requested editor
                //
                loadScript(moduleMapping[moduleName]);
            }

            return new Promise(resolve => {
                //
                // Resolve the promise right away, if the editor is loaded already
                //
                if (loadedInlineEditorsByModuleName[moduleName] !== undefined) {
                    resolve(loadedInlineEditorsByModuleName[moduleName]);
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
