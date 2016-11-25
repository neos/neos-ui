import React from 'react';
import I18n from '@neos-project/neos-ui-i18n';

const NotEmpty = value => {
    if (value === null || value === '' || value === []) {
        return <I18n id="content.inspector.validators.notEmptyValidator.isEmpty" fallback="The value can't be empty"/>;
    }
};

export default NotEmpty;
