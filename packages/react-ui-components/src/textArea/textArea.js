import React, {Component, PropTypes} from 'react';
import mergeClassNames from 'classnames';
import TextareaAutoresize from 'react-textarea-autosize';

class TextArea extends Component {
    static propTypes = {
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

    static defaultProps = {
        isValid: true
    };

    constructor(props) {
        super(props);

        this.handleValueChange = this.handleValueChange.bind(this);
    }

    render() {
        const {
            placeholder,
            className,
            isValid,
            theme,
            ...rest
        } = this.props;
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
                onChange={this.handleValueChange}
                />
        );
    }

    handleValueChange(e) {
        const value = e.target.value;
        const {onChange} = this.props;

        if (onChange) {
            onChange(value);
        }
    }
}

export default TextArea;
