import React from 'react';
import I18n from '@neos-project/neos-ui-i18n';

/**
 * Checks if the given value is a valid date
 */
interface DateTimeOptions {
    validationErrorMessage?: string;
}
const DateTime = (value: any, validatorOptions: DateTimeOptions) => {
    const dateRegularExpression = /^(\d{4})-(\d{2})-(\d{2})T(\d{2})\:(\d{2})\:(\d{2})[+-](\d{2})\:(\d{2})$/; // eslint-disable-line

    if (value !== undefined && value !== null && value !== '' && value.length > 0 && (dateRegularExpression.test(value) === false || /Invalid|NaN/.test(new Date(value).toString()))) {
        const label = validatorOptions?.validationErrorMessage ?? 'content.inspector.validators.dateTimeRangeValidator.invalidDate';
        return <I18n id={label}/>;
    }
    return null;
};

export default DateTime;
