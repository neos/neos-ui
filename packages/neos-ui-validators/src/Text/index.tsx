import React from 'react';
import I18n from '@neos-project/neos-ui-i18n';

/**
 * Checks if the given value is valid text
 * and contains no XML-tags
 */
const Text = (value: any) => {
    if (value !== undefined && value !== null && value !== value.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, '')) {
        return <I18n id="content.inspector.validators.textValidator.validTextWithoutAnyXMLtagsIsExpected"/>;
    }
    return null;
};

export default Text;
