import React from 'react';
import I18n from '@neos-project/neos-ui-i18n';
import logger from '@neos-project/utils-logger';

/**
 * Checks if the given value is a valid string (or can be cast to a string
 * if an object is given) and its length is between minimum and maximum
 * specified in the validation options.
 */
const StringLength = (value, validatorOptions) => {
    const minimum = parseInt(validatorOptions.minimum, 10);
    const maximum = parseInt(validatorOptions.maximum, 10);

    if (maximum < minimum) {
        logger.error('The maximum is less than the minimum.');
    } else if (minimum < 0) {
        logger.error('The minimum StringLength can not be less than zero');
    }

    const stringLength = value.toString().length;
    if (stringLength < minimum || stringLength > maximum) {
        if (minimum > 0 && maximum < 10000) {
            return <I18n id="content.inspector.validators.stringLength.outOfBounds" params={{minimum, maximum}}/>;
        } else if (minimum > 0) {
            return <I18n id="content.inspector.validators.stringLength.smallerThanMinimum" params={{minimum}}/>;
        }
        return <I18n id="content.inspector.validators.stringLength.greaterThanMaximum" params={{maximum}}/>;
    }
    return null;
};

export default StringLength;
