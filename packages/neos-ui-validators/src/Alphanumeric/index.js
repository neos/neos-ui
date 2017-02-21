import React from 'react';
import I18n from '@neos-project/neos-ui-i18n';

/**
 * Checks if the given value contains only alphanumeric characters
 */
const Alphanumeric = value => {
    const regularExpression = /^[\w\d]*$/u;

    if (value.length === 0 || value.match(regularExpression) !== null) {
        return null;
    } else {
        const pattern = regularExpression.toString();
        return <I18n id="content.inspector.validators.alphanumericValidator"/>;
    }
};

export default Alphanumeric;
