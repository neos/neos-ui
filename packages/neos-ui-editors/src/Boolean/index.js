import React from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'classnames';

import CheckBox from '@neos-project/react-ui-components/src/CheckBox/';
import Label from '@neos-project/react-ui-components/src/Label/';
import I18n from '@neos-project/neos-ui-i18n';

import style from './style.css';

const toBoolean = val => {
    if (typeof val === 'string') {
        switch (true) {
            case val.toLowerCase() === 'true':
            case val.toLowerCase() === 'on':
            case val.toLowerCase() === '1':
                return true;

            default:
                return false;
        }
    }

    return Boolean(val);
};

const defaultOptions = {
    disabled: false
};

const BooleanEditor = props => {
    const {value, label, identifier, commit, options} = props;
    const finalOptions = Object.assign(defaultOptions, options);

    const finalClassName = mergeClassNames({
        [style.boolean__disabled]: finalOptions.disabled
    });

    return (
        <div>
            <Label htmlFor={identifier} className={finalClassName}>
                <CheckBox id={identifier} isChecked={toBoolean(value)} isDisabled={finalOptions.disabled} onChange={commit}/>
                <I18n id={label}/>
            </Label>
        </div>
    );
};
BooleanEditor.propTypes = {
    identifier: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    commit: PropTypes.func.isRequired,
    options: PropTypes.object
};

export default BooleanEditor;
