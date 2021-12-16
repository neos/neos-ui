import React from 'react';
import I18n from '@neos-project/neos-ui-i18n';

/**
 * Checks if the given value is a string
 */
interface StringOptions {
    validationErrorMessage?: string;
}
const String = (value: any, validatorOptions: StringOptions) => {
    if (value !== undefined && value !== null && typeof value !== 'string') {
        const label = validatorOptions.validationErrorMessage ?? 'content.inspector.validators.stringValidator.stringIsExpected';
        return <I18n id={label}/>;
    }
    return null;
};

export default String;
