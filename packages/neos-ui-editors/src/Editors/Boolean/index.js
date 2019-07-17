import React from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'classnames';

import CheckBox from '@neos-project/react-ui-components/src/CheckBox/';
import Label from '@neos-project/react-ui-components/src/Label/';
import I18n from '@neos-project/neos-ui-i18n';

import style from './style.css';

// ToDo: Move into re-usable fn - Maybe into `util-helpers`?
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
    const {value, label, commit, options, className} = props;
    const finalOptions = Object.assign({}, defaultOptions, options);

    const wrapperClassName = mergeClassNames({
        [className]: true,
        [style.boolean__wrapper]: true
    });

    const finalClassName = mergeClassNames({
        [style.boolean__disabled]: finalOptions.disabled,
        [style.boolean__label]: true
    });

    return (
        <div className={wrapperClassName}>
            <Label className={finalClassName}>
                <CheckBox isChecked={toBoolean(value)} disabled={finalOptions.disabled} onChange={commit}/>
                <I18n id={label}/>
            </Label>
            {props.renderHelpIcon ? props.renderHelpIcon() : ''}
        </div>
    );
};
BooleanEditor.propTypes = {
    className: PropTypes.string,
    identifier: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    commit: PropTypes.func.isRequired,
    renderHelpIcon: PropTypes.func,
    options: PropTypes.object
};

export default BooleanEditor;
