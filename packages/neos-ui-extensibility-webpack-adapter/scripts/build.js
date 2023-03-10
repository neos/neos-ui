#!/usr/bin/env node
const fs = require('fs');
const webpack = require('webpack');

const makeConfiguration = require('./helpers/webpack.config.js');
const packageJsonPath = process.cwd() + '/package.json';

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

const compiler = webpack(makeConfiguration(packageJson.neos));

require('./helpers/banner');

compiler.run((err, stats) => {
    if (!stats.hasErrors() && !stats.hasWarnings()) {
        console.log('SUCCESS, done!');
        process.exit(0);
        return;
    }

    if (stats.compilation.warnings.length) {
        stats.compilation.warnings.forEach(console.warn);
    }

    if (stats.compilation.errors.length) {
        stats.compilation.errors.forEach(console.error);
    }

    process.exit(1);
});
