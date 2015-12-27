// Tests the structure of an Object for requiredKeys.
module.exports = function hasObjectRequiredKeys(obj, requiredKeysArray) {
    'use strict';

    var returnVal = {
        result: true
    };

    if (obj && requiredKeysArray) {
        requiredKeysArray.forEach(function (key) {
            var isKeyInOptions = key in obj;

            if (!isKeyInOptions) {
                returnVal.result = false;
                returnVal.missingKey = key;
            }
        });
    } else {
        returnVal.result = false;
    }

    return returnVal;
};
