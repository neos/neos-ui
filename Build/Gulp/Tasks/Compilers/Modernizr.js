var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var Logger = require('./../../Utilities/Logger.js');
var config = require('./../../Config.js');
var packages = require('./../../Index.js').getPackages();
var modernizrConfig = config.modernizr;

gulp.task('compile:modernizr', function () {
    'use strict';

    var searchPaths = [];

    // Loop over each package.
    packages.forEach(function (packageModel) {
        var packageConfig = packageModel.options;

        // Add search paths, if the package has sass/js sources.
        if (packageConfig.sass) {
            searchPaths = searchPaths.concat(packageModel.getBasePaths('sass'));
        }

        if (packageConfig.scripts) {
            searchPaths = searchPaths.concat(packageModel.getBasePaths('scripts'));
        }
    });

    // Scan all searchPaths, and build the final modernizr file.
    return gulp.src(searchPaths)
        .pipe(plugins.modernizr(modernizrConfig.fileName, modernizrConfig.config))
        .on('error', Logger)
        .pipe(gulp.dest(modernizrConfig.destPath))
});
