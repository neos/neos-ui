import React, {PropTypes} from 'react';
import mergeClassNames from 'classnames';

const onChangeHandler = (e, cb) => {
    const value = e.target.value.substr(0, 140);

    if (cb) {
        cb(value);
    }
};

const TextInput = props => {
    const {
        placeholder,
        className,
        isValid,
        onChange,
        theme,
        ...rest
    } = props;
    const classNames = mergeClassNames({
        [className]: className && className.length,
        [theme.textInput]: true,
        [theme['textInput--invalid']]: !isValid
    });

    return (
        <input
            {...rest}
            className={classNames}
            role="textbox"
            placeholder={placeholder}
            onChange={e => onChangeHandler(e, onChange)}
            />
    );
};
TextInput.propTypes = {
    // Style related propTypes.
    isValid: PropTypes.bool.isRequired,
    className: PropTypes.string,
    placeholder: PropTypes.string,

    // Interaction related propTypes.
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    theme: PropTypes.shape({
        'textInput': PropTypes.string,
        'textInput--invalid': PropTypes.string
    }).isRequired
};
TextInput.defaultProps = {
    isValid: true
};

export default TextInput;
