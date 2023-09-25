/* eslint-disable */ // IDGAF
import * as plowOriginal from 'plow-js';

const MAX_WARNINGS = 20;

let warningCount = 0;

let isDev = undefined;

function augmentAndDeprecatedFunction(functionName, functionImplementation) {
    return function() {
        if (isDev === undefined && window?.neos?.systemEnv) {
            // if we are called before `window.neos` is set, we are in super early boot stage - in the manifest of a plugin
            isDev = window.neos.systemEnv.startsWith('Development');
        }
        if (isDev) {
            if (warningCount < MAX_WARNINGS) {
                ++warningCount;
                console.error(`Warning: Plow.js "${functionName}" is deprecated! See: https://github.com/neos/neos-ui/issues/3425`);
            }
            if (warningCount === MAX_WARNINGS) {
                ++warningCount;
                console.error(`Warning: Further Plow.js deprecations will be ignored.`)
            }
        }
        return functionImplementation.apply(this, arguments);
    };
}

const deprecatedPlow = {};

for (const functionName in plowOriginal) {
    const functionImplementation = plowOriginal[functionName];

    if (typeof functionImplementation === 'function') {
        deprecatedPlow[functionName] = augmentAndDeprecatedFunction(functionName, functionImplementation);
    } else {
        deprecatedPlow[functionName] = functionImplementation;
    }
}

export { deprecatedPlow as plow };
