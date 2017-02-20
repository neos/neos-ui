import React from 'react';
import I18n from '@neos-project/neos-ui-i18n';
import logger from '@neos-project/utils-logger';

const RegularExpression = (value, validatorOptions) => {
    const match = validatorOptions.regularExpression.match(new RegExp('^/(.*?)/([gimy]*)$'));
    const regularExpression = new RegExp(match[1], match[2]);

    if (value.length === 0 || value.match(regularExpression) !== null) {
        return null;
    } else {
        return <I18n id="content.inspector.validators.regularExpressionValidator.patternDoesNotMatch" params={{regularExpression}}/>;
    }
};

export default RegularExpression;
