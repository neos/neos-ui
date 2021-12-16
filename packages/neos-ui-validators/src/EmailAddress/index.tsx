import React from 'react';
import I18n from '@neos-project/neos-ui-i18n';
import isEmail from 'isemail';

const isNil = (value: any) => value === null || value === undefined;

/**
 * Checks if the given value is a valid email address
 * Source: http://fightingforalostcause.net/misc/2006/compare-email-regex.php
 */
interface EmailAddressOptions {
    regularExpression: string;
    validationErrorMessage?: string;
}
const EmailAddress = (value: any, validatorOptions: EmailAddressOptions) => {
    if (isNil(value) || value === '') {
        return null;
    }
    const label = validatorOptions.validationErrorMessage ?? 'content.inspector.validators.emailAddressValidator.invalidEmail';
    return isEmail.validate(value) ? null : <I18n id={label}/>;
};

export default EmailAddress;
