import React from 'react';
import I18n from '@neos-project/neos-ui-i18n';
import isEmail from 'isemail';

const isNil = (value: any) => value === null || value === undefined;

/**
 * Checks if the given value is a valid email address
 * Source: http://fightingforalostcause.net/misc/2006/compare-email-regex.php
 */
const EmailAddress = (value: any) => {
    if (isNil(value) || value === '') {
        return null;
    }

    return isEmail.validate(value) ? null : <I18n id="content.inspector.validators.emailAddressValidator.invalidEmail"/>;
};

export default EmailAddress;
