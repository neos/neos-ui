const yaml = require('js-yaml');
const fs = require('fs');
const env = require('./Environment');

module.exports = function readYaml(path, fileNotFoundMessage) {
    var data = {};

    try {
        data = yaml.safeLoad(fs.readFileSync(path, 'utf8'));
    } catch (e) {
        if (e.code === 'ENOENT' && fileNotFoundMessage) {
            // Do not display warnings while running in CI.
            if (!env.isCi) {
                console.error(fileNotFoundMessage);
            }
        } else {
            throw e;
        }
    }

    return data;
};
