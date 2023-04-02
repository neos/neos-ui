import * as plowOriginal from 'plow-js';

function augmentAndDeprecatedFunction(functionName, functionImplementation) {
    return function() {
        if (window?.neos?.systemEnv?.startsWith('Development')) {
            console.warn(`Plow.js "${functionName}" is deprecated! See: https://github.com/neos/neos-ui/issues/3425`);
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
