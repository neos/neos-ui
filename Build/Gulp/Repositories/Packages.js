var Package = require('./../Models/Package.js');
var _ = require('lodash');

var Packages = function Packages() {
    'use strict';

    this.models = [];
    this.taskFunctions = [];
};
Packages.prototype.addPackage = function (packageOptions) {
    'use strict';

    var config = _.extend({}, {
        options: packageOptions
    }, {
        repository: this
    });
    var newPackage = new Package(config);

    this.models.push(newPackage);

    return newPackage;
};
Packages.prototype.getPackages = function () {
    'use strict';

    return this.models;
};
Packages.prototype.addPackageTask = function (tasks) {
    'use strict';

    _.forEach(tasks, function (task) {
        this.taskFunctions.push(task);
    }.bind(this));

    return this;
};
Packages.prototype.getPackageTasks = function () {
    'use strict';

    return this.taskFunctions;
};

module.exports = Packages;
