import React from 'react';
import I18n from '@neos-project/neos-ui-i18n';
import logger from '@neos-project/utils-logger';

/**
 * Checks if the given value is a valid number (or can be cast to a number
 * if an object is given) and its value is between minimum and maximum
 * specified in the validation options.
 */
interface NumberRangeOptions {
    minimum: number | string;
    maximum: number | string;
}
const NumberRange = (value: any, validatorOptions: NumberRangeOptions) => {
    if (value === undefined || value === null || value === '') {
        return null;
    }
    const minimum = typeof validatorOptions.minimum === 'number' ? validatorOptions.minimum : parseInt(validatorOptions.minimum, 10);
    const maximum = typeof validatorOptions.maximum === 'number' ? validatorOptions.maximum : parseInt(validatorOptions.maximum, 10);

    if (maximum < minimum) {
        logger.error('The maximum is less than the minimum.');
        return 'The maximum is less than the minimum.';
    }

    let number = null;

    if (typeof value === 'number') {
        number = value;
    } else {
        number = parseInt(value, 10);
    }

    if (value.length > 0 && !Number.isSafeInteger(number)) {
        return <I18n id="content.inspector.validators.numberRangeValidator.validNumberExpected"/>;
    }
    if (number < minimum || number > maximum) {
        return <I18n id="content.inspector.validators.numberRangeValidator.numberShouldBeInRange" params={{minimum, maximum}}/>;
    }
    return null;
};

export default NumberRange;
