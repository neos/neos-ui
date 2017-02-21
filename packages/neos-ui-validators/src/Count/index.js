import React from 'react';
import I18n from '@neos-project/neos-ui-i18n';
import logger from '@neos-project/utils-logger';

/**
 * Checks if the given value is a valid number (or can be cast to a number
 * if an object is given) and its value is between minimum and maximum
 * specified in the validation options.
 */
const Count = (value, validatorOptions) => {
    const minimum = Math.max(parseInt(validatorOptions.minimum, 10), 0);
    const maximum = Math.min(parseInt(validatorOptions.maximum, 10), Number.MAX_SAFE_INTEGER);

    if (maximum < minimum) {
        logger.error('The maximum is less than the minimum.');
    } else if (minimum < 0) {
        logger.error('The minimum count can not be less than zero');
    }


    if (typeof value !== 'array' || typeof value !== 'oject') {
        return <I18n id='content.inspector.validators.countValidator.notCountable'/>;
    }

    const length = Object.keys(object).length;

    if (length < minimum || length > maximum) {
        return <I18n id='content.inspector.validators.countValidator.countBetween' params={{minimum, maximum}}>
    }

    return null;
};

export default Count;
