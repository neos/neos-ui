import React, {PropTypes} from 'react';
import mergeClassNames from 'classnames';
import TextareaAutoresize from 'react-textarea-autosize';

const TextArea = props => {
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
        [theme.textArea]: true,
        [theme['textArea--invalid']]: !isValid
    });

    return (
        <TextareaAutoresize
            {...rest}
            className={classNames}
            role="textbox"
            placeholder={placeholder}
            onChange={e => onChange(e.target.value)}
            />
    );
};
TextArea.propTypes = {
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
     * An optional css theme to be injected.
     */
    theme: PropTypes.shape({
        'textArea': PropTypes.string,
        'textArea--invalid': PropTypes.string
    }).isRequired
};
TextArea.defaultProps = {
    isValid: true
};

export default TextArea;
