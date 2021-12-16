import React from 'react';
import I18n from '@neos-project/neos-ui-i18n';

const isNotEmpty = (value: any) => {
    return value !== null && value !== undefined && value.length !== 0;
};

/**
 * Checks if the given value is a valid Integer number
 */
interface IntegerOptions {
    validationErrorMessage?: string;
}
const Integer = (value: any, validatorOptions: IntegerOptions) => {
    const number = parseInt(value, 10);

    if (isNotEmpty(value) &&
        (!Number.isSafeInteger(number) ||
        // if the value contains other characters than '-' or a digit it's not valid
        !(/^[\d-]+$/.test(value)))) {
        const label = validatorOptions?.validationErrorMessage ?? 'content.inspector.validators.integerValidator.aValidIntegerNumberIsExpected';
        return <I18n id={label}/>;
    }
    return null;
};

export default Integer;
