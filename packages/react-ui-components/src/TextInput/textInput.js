import React, {PureComponent, PropTypes} from 'react';
import mergeClassNames from 'classnames';
import Tooltip from '../Tooltip/index';

class TextInput extends PureComponent {
    static propTypes = {
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
         * An array of error messages
         */
        validationErrors: PropTypes.array,

        /**
         * An optional css theme to be injected.
         */
        theme: PropTypes.shape({
            'textInput': PropTypes.string,
            'textInput--invalid': PropTypes.string
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
            validationErrors,
            theme,
            ...rest
        } = this.props;
        const classNames = mergeClassNames({
            [className]: className && className.length,
            [theme.textInput]: true,
            [theme['textInput--invalid']]: validationErrors && validationErrors.length > 0
        });

        const renderedErrors = validationErrors && validationErrors.map((validationError, key) => {
            return <span key={key}>{validationError}</span>;
        });

        return (
            <div className={theme.wrap}>
                <input
                    {...rest}
                    className={classNames}
                    role="textbox"
                    placeholder={placeholder}
                    onChange={this.handleValueChange}
                    />
                {renderedErrors && renderedErrors.length > 0 && <Tooltip>{renderedErrors}</Tooltip>}
            </div>
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
