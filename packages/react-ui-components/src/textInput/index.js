import React, {PropTypes} from 'react';
import mergeClassNames from 'classnames';
import executeCallback from './../_lib/executeCallback.js';
// import style from './style.css';

const onChangeHandler = (e, cb) => {
    const value = e.target.value.substr(0, 140);

    if (cb) {
        cb(value);
    }
};

const TextInput = props => {
    const {
        type,
        placeholder,
        className,
        isValid,
        onChange,
        onFocus,
        onBlur,
        style,
        ...rest
    } = props;
    const classNames = mergeClassNames({
        [className]: className && className.length,
        [style.textInput]: true,
        [style['textInput--invalid']]: !isValid
    });

    return (
        <input
            {...rest}
            className={classNames}
            type={type}
            role="textbox"
            placeholder={placeholder}
            onChange={e => onChangeHandler(e, onChange)}
            onFocus={() => executeCallback({cb: onFocus})}
            onBlur={() => executeCallback({cb: onBlur})}
            />
    );
};
TextInput.propTypes = {
    // Style related propTypes.
    isValid: PropTypes.bool.isRequired,
    className: PropTypes.string,
    placeholder: PropTypes.string,
    type: PropTypes.string,

    // Interaction related propTypes.
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    style: PropTypes.object
};
TextInput.defaultProps = {
    style: {},
    type: 'text',
    isValid: true
};

export default TextInput;
