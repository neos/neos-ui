import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'classnames';

class TextInput extends PureComponent {
    static propTypes = {
        /**
         * An optional className to render on the textarea node.
         */
        className: PropTypes.string,

        /**
         * An optional className for the surrounding container div.
         */
        containerClassName: PropTypes.string,

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
         * Highlight input
         */
        highlight: PropTypes.bool,

        /**
         * This prop controls if the TextInput is disabled or not.
         */
        disabled: PropTypes.bool,

        /**
         * This prop controls if the TextInput is marked as invalid or not.
         */
        invalid: PropTypes.bool,

        /**
         * An optional css theme to be injected.
         */
        theme: PropTypes.shape({
            'textInput': PropTypes.string,
            'textInput--invalid': PropTypes.string,
            'textInput--highlight': PropTypes.string
        }).isRequired
    };

    constructor(props) {
        super(props);

        this.handleValueChange = this.handleValueChange.bind(this);
    }

    render() {
        const {
            placeholder,
            className,
            theme,
            highlight,
            containerClassName,
            disabled,
            invalid,
            ...rest
        } = this.props;
        const classNames = mergeClassNames({
            [className]: className && className.length,
            [theme.textInput]: true,
            [theme['textInput--invalid']]: invalid,
            [theme['textInput--highlight']]: highlight,
            [theme['textInput--disabled']]: disabled
        });

        return (
            <div className={containerClassName}>
                <input
                    {...rest}
                    className={classNames}
                    role="textbox"
                    placeholder={placeholder}
                    disabled={disabled}
                    onChange={this.handleValueChange}
                    />
            </div>
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

export default TextInput;
