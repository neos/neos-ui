import React from 'react';
import I18n from '@neos-project/neos-ui-i18n';
/**
 * Checks if the given value is a valid floating point number
 */
interface FloatOptions {
    validationErrorMessage?: string;
}
const Float = (value: any, validatorOptions: FloatOptions) => {
    const number = parseFloat(value);
    if (value !== null && value !== undefined && value.length !== 0 && ((isNaN(number) || value.toString().match(/^[-+]?[0-9]*\.[0-9]+([eE][-+]?[0-9]+)?$/) === null))) {
        const label = validatorOptions?.validationErrorMessage ?? 'content.inspector.validators.floatValidator.validFloatExpected';
        return <I18n id={label}/>;
    }
    return null;
};

export default Float;
