import React, {PropTypes} from 'react';
import mergeClassNames from 'classnames';
import {executeCallback} from 'Shared/Utilities/index';
import style from './style.css';
import TextareaAutoresize from 'react-textarea-autosize';

const TextArea = props => {
    const {
        placeholder,
        className,
        isValid,
        onChange,
        onFocus,
        onBlur,
        ...directProps
    } = props;
    const classNames = mergeClassNames({
        [className]: className && className.length,
        [style.textInput]: true,
        [style['textInput--invalid']]: !isValid
    });

    return (
        <TextareaAutoresize
            className={classNames}
            role="textbox"
            placeholder={placeholder}
            onChange={e => onChange(e.target.value)}
            onFocus={() => executeCallback({cb: onFocus})}
            onBlur={() => executeCallback({cb: onBlur})}
            {...directProps}
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
    onBlur: PropTypes.func
};
TextArea.defaultProps = {
    isValid: true
};

export default TextArea;
