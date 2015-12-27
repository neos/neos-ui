var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var Logger = require('./../../Utilities/Logger.js');
var config = require('./../../Config.js');

module.exports = {
    requiredKeysObject: {
        'scripts': ['src', 'dest', 'filePattern', 'bundles']
    },
    createTask: function createTask(packageModel) {
        'use strict';

        var packageConfig = packageModel.options;
        var packageName = packageConfig.name;
        var packageBasePath = packageConfig.basePath;
        var scriptsConfig = packageConfig.scripts;
        var bundles = scriptsConfig.bundles;
        var srcBasePath = packageBasePath + scriptsConfig.src;
        var destBasePath = packageBasePath + scriptsConfig.dest;
        var packageScriptTasks = [];

        if (!scriptsConfig) {
            return this;
        }

        // Since browserify is bundle based, and a package could have multiple bundles, loop over the bundles array.
        bundles.forEach(function (bundle) {
            // Since we dont want much repition in each PackageConfig file, and the browserify API needs the full reference to each bundle file,
            // build a new browserifyConfig which will be passed to the API.
            var browserifyConfig = {
                entries: bundle.src ? './' + srcBasePath + bundle.src : null,
                dest: destBasePath,
                outputName: bundle.dest,
                transform: bundle.transform
            };
            var bundleSettings = bundle.settings || {};
            var taskName = 'compile:scripts:' + packageName + ':' + bundle.name;

            // Push the taskName which will be created, to an main array which holds all taskNames for the super-tasks/compiler (f.e. compile:scripts).
            config.tasks.push(taskName);

            // Push the name into the main package script tasks array.
            packageScriptTasks.push(taskName);

            // Create the sub-bundle-compiler task.
            return gulp.task(taskName, function () {
                var b = browserify(browserifyConfig);

                // API support for browserify.
                if (bundleSettings.external) {
                    b.external(bundleSettings.external);
                }
                if (bundleSettings.ignore) {
                    b.ignore(bundleSettings.ignore);
                }
                if (bundleSettings.exclude) {
                    b.exclude(bundleSettings.exclude);
                }
                if (bundleSettings.require) {
                    b.require(bundleSettings.require);
                }
                if (bundleSettings.transforms) {
                    bundleSettings.transforms.forEach(function each (transform) {
                        var transformer = require(transform.name);

                        b.transform(transformer, transform.options);
                    });
                }

                return b.bundle()
                    .on('error', Logger)
                    .pipe(source(browserifyConfig.outputName))
                    .pipe(buffer())
                    .pipe(plugins.if(config.project.isInLiveMode, plugins.uglify()))
                    .pipe(gulp.dest(browserifyConfig.dest));
            });
        });

        // Create a main package script task
        gulp.task('compile:scripts:' + packageName, packageScriptTasks);

        return this;
    }
};
