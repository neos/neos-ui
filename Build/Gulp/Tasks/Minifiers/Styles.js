var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var Logger = require('./../../Utilities/Logger.js');
var config = require('./../../Config.js');

module.exports = function minifyStyles(packageModel) {
    'use strict';

    var packageConfig = packageModel.options;
    var packageName = packageConfig.name;
    var packageBasePath = packageConfig.basePath;
    var sassConfig = packageConfig.sass;
    var taskName = 'minify:styles:' + packageName;

    if (!sassConfig) {
        return this;
    }

    // Push the taskName which will be created, to an main array which holds all taskNames for the super-tasks/compiler (f.e. minify:styles).
    config.tasks.push(taskName);

    // Create the sub-minifier task.
    return gulp.task(taskName, function () {
        return gulp.src(packageBasePath + sassConfig.dest + '/**/*.css')
            .pipe(plugins.minifyCss())
            .on('error', Logger)
            .pipe(gulp.dest(packageBasePath + sassConfig.dest));
    });
};
