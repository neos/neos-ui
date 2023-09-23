import React from 'react';
import I18n from '@neos-project/neos-ui-i18n';
import logger from '@neos-project/utils-logger';

/**
 * Checks if the given value is an object or array
 * and its amount is between minimum and maximum
 * specified in the validation options.
 */
interface CountOptions {
    minimum: number | string;
    maximum: number | string;
    validationErrorMessage?: string;
}
const Count = (value: any, validatorOptions: CountOptions) => {
    const minimum = Math.max(
        typeof validatorOptions.minimum === 'number' ? validatorOptions.minimum : parseInt(validatorOptions.minimum, 10),
        0
    );
    const maximum = Math.min(
        typeof validatorOptions.maximum === 'number' ? validatorOptions.maximum : parseInt(validatorOptions.maximum, 10),
        Number.MAX_SAFE_INTEGER
    );

    if (maximum < minimum) {
        logger.error('The maximum is less than the minimum.');
        return 'The maximum is less than the minimum.';
    }

    if (typeof value !== 'object' || value === null) {
        return <I18n id="content.inspector.validators.countValidator.notCountable" packageKey="Neos.Neos.Ui" sourceName="Main" />;
    }

    const {length} = Object.keys(value);

    // This means if the _minimum_ is > 0 then there is no error shown as long as the field is empty (length === 0)
    // WHY: We want to use the NotEmptyValidator for validating required fields.
    if (length === 0) {
        return null;
    }

    if (length < minimum || length > maximum) {
        const label = validatorOptions?.validationErrorMessage ?? 'content.inspector.validators.countValidator.countBetween';
        return <I18n id={label} params={{minimum, maximum}} packageKey="Neos.Neos.Ui" sourceName="Main" />;
    }

    return null;
};

export default Count;
