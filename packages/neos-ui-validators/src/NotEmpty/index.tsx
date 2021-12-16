import React from 'react';
import I18n from '@neos-project/neos-ui-i18n';

/**
 * Checks if a given value is not empty
 */
interface NotEmptyOptions {
    validationErrorMessage?: string;
}
const NotEmpty = (value: any, validatorOptions: NotEmptyOptions) => {
    if (value === undefined || value === null || value === '' || value.length === 0) {
        const label = validatorOptions.validationErrorMessage ?? 'content.inspector.validators.notEmptyValidator.isEmpty';
        return <I18n id={label}/>;
    }
    return null;
};

export default NotEmpty;
