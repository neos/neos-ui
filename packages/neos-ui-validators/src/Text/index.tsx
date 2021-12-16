import React from 'react';
import I18n from '@neos-project/neos-ui-i18n';

/**
 * Checks if the given value is valid text
 * and contains no XML-tags
 */
interface TextOptions {
    validationErrorMessage?: string;
}
const Text = (value: any, validatorOptions: TextOptions) => {
    if (value !== undefined && value !== null && value !== value.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, '')) {
        const label = validatorOptions.validationErrorMessage ?? 'content.inspector.validators.textValidator.validTextWithoutAnyXMLtagsIsExpected';
        return <I18n id={label}/>;
    }
    return null;
};

export default Text;
