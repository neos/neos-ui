import React from 'react';
import I18n from '@neos-project/neos-ui-i18n';

/**
 * Checks if the given value is a valid floating point number
 */
const Float = value => {
    const number = parseFloat(value);

    if (value.length !== 0 && (isNaN(number) || value.toString().match(/.+\d$/) === null)) {
        return <I18n id="content.inspector.validators.floatValidator.validFloatExpected"/>;
    }
    return null;
};

export default Float;
