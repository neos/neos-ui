var gulp = require('gulp');
var _ = require('lodash');
var hasObjectRequiredKeys = require('./../Utilities/HasObjectRequiredKeys.js');
var errorMessageSuffix = ' while initiating a new Package, please refer to the example PackageConfig.js.';
var requiredPrimaryKeys = ['basePath', 'name'];

var Package = function Package(obj) {
    'use strict';

    var options = obj.options;

    this.repository = obj.repository;
    this.options = options;

    this.evaluteRequiredPackageKeys();
    this.createTasks();

    return this;
};

Package.prototype.evaluteRequiredPackageKeys = function () {
    'use strict';

    var options = this.options;
    var testResults = hasObjectRequiredKeys(options, requiredPrimaryKeys);
    var hasRequiredAttributes = testResults.result;

    // An Package needs an configuration object.
    if (!options) {
        throw new Error('Please set an options object' + errorMessageSuffix);
    }

    // Throw an error for each missing primary key/val pair.
    if (!hasRequiredAttributes) {
        throw new Error('Attribute "' + testResults.missingKey + '" was not found' + errorMessageSuffix);
    }

    return hasRequiredAttributes;
};

Package.prototype.createTasks = function () {
    'use strict';

    var packageModel = this;
    var options = this.options;
    var tasks = this.repository.getPackageTasks();

    // Loop over each registered task.
    _.forEach(tasks, function (taskExport) {
        var hasTaskRequiredKeys = _.isObject(taskExport) && taskExport.requiredKeysObject;
        var taskFunction = taskExport;
        var hasRequiredAttributes = true;

        // If the task itself has a required object structure for the package, evaluate it.
        if (hasTaskRequiredKeys) {
            hasRequiredAttributes = packageModel.evaluteTasksRequiredKeys(taskExport.requiredKeysObject, options);

            // Re-Assign the variable which will be executed if the taskExport is an object.
            taskFunction = taskExport.createTask;
        }

        // If all attributes are present, create the task.
        if (hasRequiredAttributes) {
            taskFunction(packageModel);
        }
    });

    return this;
};

Package.prototype.evaluteTasksRequiredKeys = function evaluteTasksRequiredKeys(tasksRequiredKeysObject, packageOptions) {
    'use strict';

    var hasRequiredAttributes = true;

    // Loop over each section of the requiredKeysObject.
    _.forEach(tasksRequiredKeysObject, function (requiredKeys, targetKey) {
        var testResults = hasObjectRequiredKeys(packageOptions[targetKey], requiredKeys);

        // If a missing key was found, throw an error.
        if (!testResults.result && testResults.missingKey && hasRequiredAttributes) {
            hasRequiredAttributes = false;

            throw new Error('Missing attribute "' + testResults.missingKey + '" in object "' + targetKey + '" ' + errorMessageSuffix);
        }
    });

    return hasRequiredAttributes;
};

Package.prototype.getBasePaths = function (type) {
    'use strict';

    var packageConfig = this.options;
    var typeConfig = packageConfig[type];
    var basePaths = [];

    if (typeConfig) {
        if (_.isArray(typeConfig.filePattern)) {
            typeConfig.filePattern.forEach(function (filePattern) {
                var basePath = packageConfig.basePath + typeConfig.src + filePattern;
                if (filePattern.indexOf('!') === 0) {
                    basePath = '!' + packageConfig.basePath + typeConfig.src + filePattern.replace('!', '');
                }

                basePaths.push(basePath);
            });
        } else {
            basePaths.push(packageConfig.basePath + typeConfig.src + typeConfig.filePattern);
        }
    }

    return basePaths;
};

module.exports = Package;
