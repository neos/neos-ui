import React from 'react';
import I18n from '@neos-project/neos-ui-i18n';
import logger from '@neos-project/utils-logger';

/**
 * Checks if the given value is a valid string (or can be cast to a string
 * if an object is given) and its length is between minimum and maximum
 * specified in the validation options.
 * If ignoreHtml is true, HTML tags won't be counted: "Some <b>bold</b> text": 14 characters (not 21)
 */
interface StringLengthOptions {
    minimum: number | string;
    maximum: number | string;
    ignoreHtml: boolean;
}
const StringLength = (value: any, validatorOptions: StringLengthOptions) => {
    if (value === undefined || value === null || value === '') {
        return null;
    }

    const minimum = typeof validatorOptions.minimum === 'number' ? validatorOptions.minimum : parseInt(validatorOptions.minimum, 10);
    const maximum = typeof validatorOptions.maximum === 'number' ? validatorOptions.maximum : parseInt(validatorOptions.maximum, 10);

    if (maximum < minimum) {
        logger.error('The maximum is less than the minimum.');
        return 'The maximum is less than the minimum.';
    }
    if (minimum < 0) {
        logger.error('The minimum StringLength can not be less than zero');
        return 'The minimum StringLength can not be less than zero';
    }

    let castedValue = value.toString ? value.toString() : '';
    if (validatorOptions.ignoreHtml) {
        const documentNode = new DOMParser().parseFromString(castedValue, 'text/html');
        castedValue = documentNode.body.textContent ? documentNode.body.textContent : castedValue;
    }
    const stringLength = castedValue.length;
    if (stringLength < minimum || stringLength > maximum) {
        if (minimum > 0 && maximum < 10000) {
            return <I18n id="content.inspector.validators.stringLength.outOfBounds" params={{minimum, maximum}}/>;
        }
        if (minimum > 0) {
            return <I18n id="content.inspector.validators.stringLength.smallerThanMinimum" params={{minimum}}/>;
        }
        return <I18n id="content.inspector.validators.stringLength.greaterThanMaximum" params={{maximum}}/>;
    }
    return null;
};

export default StringLength;
