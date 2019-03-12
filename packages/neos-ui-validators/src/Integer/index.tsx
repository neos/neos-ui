import React from 'react';
import I18n from '@neos-project/neos-ui-i18n';

const isNotEmpty = (value: any) => {
    return value !== null && value !== undefined && value.length !== 0;
};

/**
 * Checks if the given value is a valid Integer number
 */
const Integer = (value: any) => {
    const number = parseInt(value, 10);

    if (isNotEmpty(value) &&
        (!Number.isSafeInteger(number) ||
        // if the value contains other characters than '-' or a digit it's not valid
        !(/^[\d-]+$/.test(value)))) {
        return <I18n id="content.inspector.validators.integerValidator.aValidIntegerNumberIsExpected"/>;
    }
    return null;
};

export default Integer;
