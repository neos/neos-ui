var gulp = require('gulp');
var config = require('./../Config.js');
var packages = require('./../Index.js').getPackages();

gulp.task('watch', function watch() {
    'use strict';

    // Loop over each package, and create a watcher for each task type.
    packages.forEach(function (packageModel) {
        var packageConfig = packageModel.options;
        var packageName = packageConfig.name;

        if (packageConfig.sass) {
            gulp.watch(packageModel.getBasePaths('sass'), ['compile:sass:' + packageName]);
        }

        if (packageConfig.scripts) {
            gulp.watch(packageModel.getBasePaths('scripts'), ['compile:scripts:' + packageName]);
        }
    });
});
