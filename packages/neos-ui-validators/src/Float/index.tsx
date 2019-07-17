import React from 'react';
import I18n from '@neos-project/neos-ui-i18n';
/**
 * Checks if the given value is a valid floating point number
 */
const Float = (value: any) => {
    const number = parseFloat(value);
    if (value !== null && value !== undefined && value.length !== 0 && ((isNaN(number) || value.toString().match(/^[-+]?[0-9]*\.[0-9]+([eE][-+]?[0-9]+)?$/) === null))) {
        return <I18n id="content.inspector.validators.floatValidator.validFloatExpected"/>;
    }
    return null;
};

export default Float;
