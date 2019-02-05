import React from 'react';
import I18n from '@neos-project/neos-ui-i18n';

/**
 * Checks if the given value is a string
 */
const String = (value: any) => {
    if (value !== undefined && value !== null && typeof value !== 'string') {
        return <I18n id="content.inspector.validators.stringValidator.stringIsExpected"/>;
    }
    return null;
};

export default String;
