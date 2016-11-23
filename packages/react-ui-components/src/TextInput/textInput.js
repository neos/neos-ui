import React, {PureComponent, PropTypes} from 'react';
import mergeClassNames from 'classnames';

class TextInput extends PureComponent {
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
            [theme.textInput]: true,
            [theme['textInput--invalid']]: !isValid
        });

        return (
            <input
                {...rest}
                className={classNames}
                role="textbox"
                placeholder={placeholder}
                onChange={this.handleValueChange}
                />
        );
    }

    handleValueChange(e) {
        const value = e.target.value.substr(0, 140);
        const {onChange} = this.props;

        if (onChange) {
            onChange(value);
        }
    }
}

export default TextInput;
