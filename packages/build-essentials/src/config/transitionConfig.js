const upperFirst = require('lodash.upperfirst');

const config = {
    transition: {
        fast: '.1s',
        default: '.2s',
        medium: '.3s',
        slow: '.5s'
    }
};

const generateCssVarsObject = (subject = config, predicate = '') => {
    const hasPredicate = predicate && predicate.length;
    let target = {};

    Object.keys(subject).forEach(key => {
        const val = subject[key];
        const camelKey = upperFirst(key);
        const nestedPredicate = hasPredicate ? predicate + camelKey : key;

        if (Array.isArray(val)) {
            val.forEach((item, index) => {
                target[`--${predicate}-${camelKey}-${upperFirst(item)}`] = `${index + 1}`;
            });
        } else if (typeof val === 'object') {
            target = Object.assign({}, target, generateCssVarsObject(val, nestedPredicate));
        } else {
            target[`--${predicate}-${camelKey}`] = val;
        }
    });

    return target;
};

module.exports = {config, generateCssVarsObject};
