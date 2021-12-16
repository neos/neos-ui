import React from 'react';
import I18n from '@neos-project/neos-ui-i18n';

/**
 * Checks if the given value is a valid Uuid
 */
interface UuidOptions {
    validationErrorMessage?: string;
}
const Uuid = (value: any, validatorOptions: UuidOptions) => {
    if (value !== undefined && value !== null && value.length !== 0 && value.match(/([a-f0-9]){8}-([a-f0-9]){4}-([a-f0-9]){4}-([a-f0-9]){4}-([a-f0-9]){12}/) === null) {
        const label = validatorOptions.validationErrorMessage ?? 'content.inspector.validators.uuidValidator.invalidUuid';
        return <I18n id={label}/>;
    }
    return null;
};

export default Uuid;
