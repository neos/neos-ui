import React, {PropTypes} from 'react';
import uuid from 'uuid';
import mergeClassNames from 'classnames';
import {executeCallback} from 'Host/Abstracts/';
import Label from 'Host/Components/Label/';
import style from './style.css';

const onChangeHandler = (e, cb) => {
    const value = e.target.value.substr(0, 140);

    if (cb) {
        cb(value);
    }
};

const TextInput = props => {
    const {
        label,
        placeholder,
        className,
        isValid,
        onChange,
        onFocus,
        onBlur
    } = props;
    const classNames = mergeClassNames({
        [className]: className && className.length,
        [style.textInput]: true
    });
    const inputClassNames = mergeClassNames({
        [style.textInput__input]: true,
        [style['textInput--invalid']]: !isValid
    });
    const id = uuid.v1();

    return (
        <div className={classNames}>
            <Label htmlFor={id} label={label} />
            <input
                className={inputClassNames}
                id={id}
                type="text"
                placeholder={placeholder}
                onChange={e => onChangeHandler({e, cb: onChange})}
                onFocus={() => executeCallback({cb: onFocus})}
                onBlur={() => executeCallback({cb: onBlur})}
                />
        </div>
    );
};
TextInput.propTypes = {
    label: PropTypes.string.isRequired,
    placeholder: PropTypes.string,

    // Style related propTypes.
    className: PropTypes.string,

    // State related propTypes.
    isValid: PropTypes.bool.isRequired,

    // Interaction related propTypes.
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func
};
TextInput.defaultProps = {
    isValid: true
};

export default TextInput;
