import React, {PureComponent, PropTypes} from 'react';
import mergeClassNames from 'classnames';
import TextareaAutoresize from 'react-textarea-autosize';
import Tooltip from '../Tooltip/index';

class TextArea extends PureComponent {
    static propTypes = {
        /**
         * Array of validation errors
         */
        validationErrors: PropTypes.array,

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
            [theme.textArea]: true,
            [theme['textArea--invalid']]: validationErrors && validationErrors.length > 0
        });
        const renderedErrors = validationErrors && validationErrors.length > 0 && validationErrors.map((validationError, key) => {
            return <div key={key}>{validationError}</div>;
        });

        return (
            <div className={theme.wrap}>
                <TextareaAutoresize
                    {...rest}
                    className={classNames}
                    role="textbox"
                    placeholder={placeholder}
                    onChange={this.handleValueChange}
                    />
                {renderedErrors && <Tooltip>{renderedErrors}</Tooltip>}
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

export default TextArea;
