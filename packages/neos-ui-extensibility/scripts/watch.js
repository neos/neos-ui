#!/usr/bin/env node

const fs = require('fs');
const webpack = require('webpack');
const chalk = require('chalk');

const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
const clearConsole = require('react-dev-utils/clearConsole');
const isInteractive = process.stdout.isTTY;


const makeConfiguration = require('./helpers/webpack.config.js');
const packageJsonPath = process.cwd() + '/package.json';
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const compiler = webpack(makeConfiguration(packageJson.neos));

require('./helpers/banner');

compiler.plugin('invalid', () => {
    if (isInteractive) {
        clearConsole();
    }
    console.log('Compiling...');
});

// "done" event fires when Webpack has finished recompiling the bundle.
// Whether or not you have warnings or errors, you will get this event.
compiler.plugin('done', (stats) => {
    if (isInteractive) {
        clearConsole();
    }

    // We have switched off the default Webpack output in WebpackDevServer
    // options so we are going to "massage" the warnings and errors and present
    // them in a readable focused way.
    const messages = formatWebpackMessages(stats.toJson({}, true));
    const isSuccessful = !messages.errors.length && !messages.warnings.length;

    if (isSuccessful) {
        console.log(chalk.green('Compiled successfully! - ' + new Date().toISOString()));
    }


    // If errors exist, only show errors.
    if (messages.errors.length) {
        console.log(chalk.red('Failed to compile.'));
        console.log();
        messages.errors.forEach(message => {
            console.log(message);
            console.log();
        });
        return;
    }

    // Show warnings if no errors were found.
    if (messages.warnings.length) {
        console.log(chalk.yellow('Compiled with warnings.'));
        console.log();
        messages.warnings.forEach(message => {
            console.log(message);
            console.log();
        });
        // Teach some ESLint tricks.
        console.log('You may use special comments to disable some warnings.');
        console.log('Use ' + chalk.yellow('// eslint-disable-next-line') + ' to ignore the next line.');
        console.log('Use ' + chalk.yellow('/* eslint-disable */') + ' to ignore all warnings in a file.');
    }
});



compiler.watch({}, (err, stats) => {
});
