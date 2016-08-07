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
    /**
     * This prop controls if the TextArea is rendered as invalid or not.
     */
    isValid: PropTypes.bool.isRequired,

    /**
     * An optional className to render on the textarea node.
     */
    className: PropTypes.string,

    /**
     * An optional HTML5 placeholder.
     */
    placeholder: PropTypes.string,

    /**
     * The handler which will be called once the user changes the value of the input.
     */
    onChange: PropTypes.func,

    /**
     * The handler which will be called once the user takes focus on the input.
     */
    onFocus: PropTypes.func,

    /**
     * The handler which will be called once the user leaves focus of the input.
     */
    onBlur: PropTypes.func,

    /**
     * An optional css theme to be injected.
     */
    theme: PropTypes.shape({
        'textInput': PropTypes.string,
        'textInput--invalid': PropTypes.string
    }).isRequired
};
TextInput.defaultProps = {
    isValid: true
};

export default TextInput;
