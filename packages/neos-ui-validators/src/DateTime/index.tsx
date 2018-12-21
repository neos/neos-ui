import React from 'react';
import I18n from '@neos-project/neos-ui-i18n';

/**
 * Checks if the given value is a valid date
 */
const DateTime = (value: any) => {
    const dateRegularExpression = /^(\d{4})-(\d{2})-(\d{2})T(\d{2})\:(\d{2})\:(\d{2})[+-](\d{2})\:(\d{2})$/; // eslint-disable-line

    if (value !== undefined && value !== null && value !== '' && value.length > 0 && (dateRegularExpression.test(value) === false || /Invalid|NaN/.test(new Date(value).toString()))) {
        return <I18n id="content.inspector.validators.dateTimeRangeValidator.invalidDate"/>;
    }
    return null;
};

export default DateTime;
