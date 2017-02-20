import React from 'react';
import I18n from '@neos-project/neos-ui-i18n';

const RegularExpression = (value, validatorOptions) => {
    const match = validatorOptions.regularExpression.match(new RegExp('^/(.*?)/([gimy]*)$'));
    const regularExpression = new RegExp(match[1], match[2]);

    if (value.length === 0 || value.match(regularExpression) !== null) {
        return null;
    } else {
        const pattern = regularExpression.toString();
        return <I18n id="content.inspector.validators.regularExpressionValidator.patternDoesNotMatch" params={{pattern}}/>;
    }
};

export default RegularExpression;
