import React from 'react';
import I18n from '@neos-project/neos-ui-i18n';

/**
 * Checks if a given value matches a given regular expression
 */
interface RegularExpressionOptions {
    regularExpression: string;
}
const RegularExpression = (value: any, validatorOptions: RegularExpressionOptions) => {
    // NOTE: we do not need to localize the two strings here; as they are purely integrator issues which an end user
    // will never see.
    if (!validatorOptions.regularExpression) {
        return 'The validator option "regularExpression" was not given.';
    }
    const match = validatorOptions.regularExpression.match(new RegExp('^/?(.*?)(?:/([gimy]*))?$'));
    if (!match) {
        return `The Regex ${validatorOptions.regularExpression} could not be parsed.`;
    }
    const regularExpression = new RegExp(match[1], match[2]);

    if (value === undefined || value === null || value.length === 0 || value.match(regularExpression) !== null) {
        return null;
    }
    const pattern = regularExpression.toString();
    return <I18n id="content.inspector.validators.regularExpressionValidator.patternDoesNotMatch" params={{pattern}}/>;
};

export default RegularExpression;
