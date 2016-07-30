import React, {PropTypes} from 'react';
import mergeClassNames from 'classnames';
import TextareaAutoresize from 'react-textarea-autosize';
import executeCallback from './../_lib/executeCallback.js';
// import style from './style.css';

const TextArea = props => {
    const {
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
        <TextareaAutoresize
            {...rest}
            className={classNames}
            role="textbox"
            placeholder={placeholder}
            onChange={e => onChange(e.target.value)}
            onFocus={() => executeCallback({cb: onFocus})}
            onBlur={() => executeCallback({cb: onBlur})}
            />
    );
};
TextArea.propTypes = {
    // Style related propTypes.
    isValid: PropTypes.bool.isRequired,
    className: PropTypes.string,
    placeholder: PropTypes.string,

    // Interaction related propTypes.
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    style: PropTypes.object
};
TextArea.defaultProps = {
    style: {},
    isValid: true
};

export default TextArea;
