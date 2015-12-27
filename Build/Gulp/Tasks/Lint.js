var path = require('path');

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var Logger = require('./../Utilities/Logger.js');
var esLintConfig = path.join(__dirname, '..', '.ESLintConfig.json');
var config = require('./../Config.js');
var packages = require('./../Index.js').getPackages();

var lintTasks = [];

// Loop over each package, and create a modular lint task.
packages.forEach(function (packageModel) {
    var packageConfig = packageModel.options;
    var packageName = packageConfig.name;
    var taskName = 'lint:' + packageName;
    var scriptsConfig = packageConfig.scripts;

    if (!scriptsConfig) {
        return;
    }

    lintTasks.push(taskName);

    gulp.task(taskName, function() {
        return gulp.src(packageModel.getBasePaths('scripts'))
            .pipe(plugins.eslint(esLintConfig))
            .pipe(plugins.eslint.format())
            .on('error', Logger);
    });
});

gulp.task('lint', lintTasks);
