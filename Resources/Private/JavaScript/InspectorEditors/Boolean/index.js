import React, {PropTypes} from 'react';
import {Components, I18n} from '@host';

const {CheckBox, Label} = Components;

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
}

const Boolean = props => {
    const {value, label, identifier, commit} = props;

    return (
        <div>
            <Label htmlFor={identifier}>
                <CheckBox id={identifier} isChecked={toBoolean(value)} onChange={value => commit(value)} />
                <I18n id={label} />
            </Label>
        </div>
    );
};

Boolean.propTypes = {
    value: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]).isRequired,
    commit: PropTypes.func.isRequired
};

Boolean.hasOwnLabel = true;

export default Boolean;
