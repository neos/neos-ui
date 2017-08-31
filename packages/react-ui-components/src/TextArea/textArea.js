import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'classnames';
import TextareaAutoresize from 'react-textarea-autosize';
import enhanceWithClickOutside from 'react-click-outside';

class TextArea extends PureComponent {
    static propTypes = {
        /**
         * Array of validation errors
         */
        validationErrors: PropTypes.array,

        /**
         * Highlight input
         */
        highlight: PropTypes.bool,

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
         * This prop controls if the CheckBox is disabled or not.
         */
        disabled: PropTypes.bool,

        /**
         * An optional css theme to be injected.
         */
        theme: PropTypes.shape({
            'textArea': PropTypes.string,
            'textArea--invalid': PropTypes.string
        }).isRequired,

        /**
         * Static component dependencies which are injected from the outside (index.js)
         */
        TooltipComponent: PropTypes.any.isRequired,

        /**
         * Optional number to set the minRows of the TextArea if not expanded
         */
        minRows: PropTypes.number,

        /**
         * Optional number to set the minRows of the TextArea if expanded
         */
        expandedRows: PropTypes.number
    };

    static defaultProps = {
        minRows: 2,
        expandedRows: 6
    };

    constructor(props) {
        super(props);

        this.state = {
            isFocused: false
        };

        this.handleValueChange = this.handleValueChange.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.handleOnClick = this.handleOnClick.bind(this);
    }

    handleOnClick() {
        this.setState({
            isFocused: true
        });
    }

    handleClickOutside() {
        this.setState({
            isFocused: false
        });
    }

    render() {
        const {
            TooltipComponent,
            placeholder,
            className,
            validationErrors,
            theme,
            highlight,
            disabled,
            minRows,
            expandedRows,
            ...rest
        } = this.props;
        const classNames = mergeClassNames({
            [className]: className && className.length,
            [theme.textArea]: true,
            [theme['textArea--invalid']]: validationErrors && validationErrors.length > 0,
            [theme['textArea--highlight']]: highlight,
            [theme['textArea--disabled']]: disabled
        });
        const renderedErrors = validationErrors && validationErrors.length > 0 && validationErrors.map((validationError, key) => {
            return <div key={key}>{validationError}</div>;
        });

        return (
            <div>
                <TextareaAutoresize
                    {...rest}
                    className={classNames}
                    role="textbox"
                    placeholder={placeholder}
                    disabled={disabled}
                    onChange={this.handleValueChange}
                    onClick={this.handleOnClick}
                    minRows={this.state.isFocused ? expandedRows : minRows}
                    />
                {renderedErrors && <TooltipComponent>{renderedErrors}</TooltipComponent>}
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

//
// Add the click-outside functionality to the TextArea component.
//
const EnhancedTextArea = enhanceWithClickOutside(TextArea);

export default EnhancedTextArea;
export const undecorated = TextArea;
