import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'classnames';
import omit from 'lodash.omit';

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
         * An array of error messages
         */
        validationErrors: PropTypes.array,

        /**
         * Highlight input
         */
        highlight: PropTypes.bool,

        /**
         * This prop controls if the CheckBox is disabled or not.
         */
        disabled: PropTypes.bool,

        /**
         * This prob controls what function is triggered when the enter key is pressed
         */
        onEnterKey: PropTypes.func,

        /**
         * A prop of which type this input field is eg password
         */
        type: PropTypes.string,

        /**
         * Set the focus to this input element after mount
         */
        setFocus: PropTypes.bool,

        /**
         * An optional css theme to be injected.
         */
        theme: PropTypes.shape({
            'textInput': PropTypes.string,
            'textInput--invalid': PropTypes.string,
            'textInput--highlight': PropTypes.string
        }).isRequired,

        /**
         * Static component dependencies which are injected from the outside (index.js)
         */
        TooltipComponent: PropTypes.any.isRequired
    };

    componentDidMount() {
        if (this.props.setFocus) {
            this.inputRef.focus();
        }
    }

    handleKeyPress = e => {
        const enterKeyCode = 13;
        const keyCode = e.keyCode || e.which;
        const {onEnterKey} = this.props;
        if (keyCode === enterKeyCode && typeof onEnterKey === 'function') {
            onEnterKey();
        }
    }

    handleValueChange = e => {
        const value = e.target.value;
        const {onChange} = this.props;

        if (onChange) {
            onChange(value);
        }
    }

    render() {
        const {
            TooltipComponent,
            placeholder,
            className,
            validationErrors,
            theme,
            highlight,
            containerClassName,
            disabled,
            type,
            ...restProps
        } = this.props;

        const rest = omit(restProps, ['onEnterKey', 'setFocus']);
        const classNames = mergeClassNames({
            [className]: className && className.length,
            [theme.textInput]: true,
            [theme['textInput--invalid']]: validationErrors && validationErrors.length > 0,
            [theme['textInput--highlight']]: highlight,
            [theme['textInput--disabled']]: disabled
        });

        const renderedErrors = validationErrors && validationErrors.length > 0 && validationErrors.map((validationError, key) => {
            return <div key={key}>{validationError}</div>;
        });

        const inputRef = el => {
            this.inputRef = el;
        };

        return (
            <div className={containerClassName}>
                <input
                    {...rest}
                    className={classNames}
                    role="textbox"
                    type={type}
                    placeholder={placeholder}
                    disabled={disabled}
                    onChange={this.handleValueChange}
                    onKeyPress={this.handleKeyPress}
                    ref={inputRef}
                    />
                {renderedErrors && <TooltipComponent>{renderedErrors}</TooltipComponent>}
            </div>
        );
    }
}

export default TextInput;
