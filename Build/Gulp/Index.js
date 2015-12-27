var _ = require('lodash');
var Packages = require('./Repositories/Packages.js');
var createSuperTask = require('./Utilities/CreateSuperTask.js');
var singleton;

var Build = function Build() {
    'use strict';

    this.packagesRepository = new Packages();

    this._addPackageBasedTasks();
};

Build.prototype._addPackageBasedTasks = function () {
    'use strict';

    // Setup tasks which are re-created for each package.
    this.packagesRepository.addPackageTask([
        require('./Tasks/Compilers/Sass.js'),
        require('./Tasks/Compilers/Scripts.js'),
        require('./Tasks/Minifiers/Images.js'),
        require('./Tasks/Minifiers/Scripts.js'),
        require('./Tasks/Minifiers/Styles.js')
    ]);
};

Build.prototype.addPackages = function (packageConfigs) {
    'use strict';

    _.forEach(packageConfigs, function (packageConfig) {
        this.packagesRepository.addPackage(packageConfig);
    }.bind(this));

    this._createSuperTasks();
    this._createAdditionalTasks();
};
Build.prototype.getPackages = function () {
    'use strict';

    return this.packagesRepository.getPackages();
};

Build.prototype._createSuperTasks = function () {
    'use strict';

    var tasksArray = require('./Config.js').tasks;

    // Create a task named after the second argument, which will run each matching taskName of the passed 'tasksArray' - F.e.
    //
    // createParentTasks(tasksArray, 'compile:sass');
    //
    // will create a superTask of 'compile:sass:package1' and 'compile:sass:package2'.
    createSuperTask(tasksArray, 'compile:sass');
    createSuperTask(tasksArray, 'compile:scripts');

    createSuperTask(tasksArray, 'minify:images');
    createSuperTask(tasksArray, 'minify:scripts');
    createSuperTask(tasksArray, 'minify:styles');
};

Build.prototype._createAdditionalTasks = function () {
    'use strict';

    require('./Tasks/Compilers/Modernizr.js');
    require('./Tasks/Build.js');
    require('./Tasks/Minify.js');
    require('./Tasks/Lint.js');
    require('./Tasks/Watch.js');
    require('./Tasks/Default.js');
};

module.exports = function () {
    singleton = singleton || new Build();

    return singleton;
}();
