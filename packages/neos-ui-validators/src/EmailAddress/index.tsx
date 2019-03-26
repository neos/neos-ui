import React from 'react';
import I18n from '@neos-project/neos-ui-i18n';

/**
 * Checks if the given value is a valid email address
 * Source: http://fightingforalostcause.net/misc/2006/compare-email-regex.php
 */
const EmailAddress = (value: any) => {
    const regularExpression = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i; // eslint-disable-line

    if (value !== undefined && value !== null && value.length !== 0 && value.match(regularExpression) === null) {
        return <I18n id="content.inspector.validators.emailAddressValidator.invalidEmail"/>;
    }
    return null;
};

export default EmailAddress;
