import React from 'react';
import I18n from '@neos-project/neos-ui-i18n';

/**
 * Checks if the given value is a valid Uuid
 */
const Uuid = (value: any) => {
    if (value !== undefined && value !== null && value.length !== 0 && value.match(/([a-f0-9]){8}-([a-f0-9]){4}-([a-f0-9]){4}-([a-f0-9]){4}-([a-f0-9]){12}/) === null) {
        return <I18n id="content.inspector.validators.uuidValidator.invalidUuid"/>;
    }
    return null;
};

export default Uuid;
