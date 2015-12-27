var _ = require('lodash');
var gulp = require('gulp');
var config = require('./../Config.js');

// Creates superTasks of a list of taskNames. F.e.
//
// tasksArray = ['compile:sass:package1', 'compile:sass:package2', 'compile:scripts:package1', 'compile:scripts:package2'];
// taskNameToCreate = 'compile:sass';
//
// Creates an task which will execute each taskName which fits into the taskNameToCreate scheme:
// => gulp.task('compile:sass', ['compile:sass:package1', 'compile:sass:package2']);
module.exports = function createSuperTask(tasksArray, taskNameToCreate) {
    'use strict';

    var tasksToRun = [];
    var task = null;

    _.forEach(tasksArray, function (taskName) {
        var isTaskNameRelevant = taskName.indexOf(taskNameToCreate) >= 0;

        if (isTaskNameRelevant) {
            tasksToRun.push(taskName);
        }
    });

    if (tasksToRun.length) {
        config.tasks.push(taskNameToCreate);
        task = gulp.task(taskNameToCreate, tasksToRun);
    }

    return task;
};
