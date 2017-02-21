import React from 'react';
import I18n from '@neos-project/neos-ui-i18n';

/**
 * Checks if a given value is not empty
 */
const NotEmpty = value => {
    if (value === null || value === '' || value === []) {
        return <I18n id='content.inspector.validators.notEmptyValidator.isEmpty' fallback='The value can not be empty'/>;
    }
    return null;
};

export default NotEmpty;
