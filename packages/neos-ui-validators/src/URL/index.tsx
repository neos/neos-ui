import React from 'react';
import I18n from '@neos-project/neos-ui-i18n';

/**
 * Checks if the URL format is correctly.
 */
interface URLOptions {
    validationErrorMessage?: string;
}

const URL = (value: any, validatorOptions: URLOptions) => {

    const httpFormat = /^http?:\/\//;
    const httpsFormat = /^https?:\/\//;

    if (!value.match(httpFormat) && !value.match(httpsFormat))
    {
        const label = validatorOptions?.validationErrorMessage ?? 'content.inspector.validators.urlValidator.invalidFormat';
        return <I18n id={label}/>;
    }
    return null;
};

export default URL;
