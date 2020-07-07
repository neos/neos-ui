import React, {PureComponent, ChangeEvent} from 'react';
import mergeClassNames from 'classnames';
import {omit} from 'lodash';
import {Omit} from '../../types';

interface TextInputTheme {
    readonly textInput: string;
    readonly 'textInput--disabled': string;
}

export interface TextInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    /**
     * An optional className to render on the textarea node.
     */
    readonly className?: string;

    /**
     * An optional className for the surrounding container div.
     */
    readonly containerClassName?: string;

    /**
     * Set the focus to this input element after mount
     */
    readonly setFocus?: boolean;

    /**
     * The handler which will be called once the user changes the value of the input.
     */
    readonly onChange?: (value: string) => void;

    /**
     * The handler which will be called once the user takes focus on the input.
     */
    readonly onFocus?: () => void;

    /**
     * The handler which will be called once the user leaves focus of the input.
     */
    readonly onBlur?: () => void;

    /**
     * This prob controls what function is triggered when the enter key is pressed
     */
    readonly onEnterKey?: () => void;

    /**
     * An optional css theme to be injected.
     */
    readonly theme: TextInputTheme;
}

class TextInput extends PureComponent<TextInputProps> {
    // tslint:disable-next-line:readonly-keyword
    private ref?: React.RefObject<HTMLInputElement>;

    constructor(props: any) {
        super(props);
        this.ref = React.createRef();
    }

    public readonly componentDidMount = (): void => {
        if (this.ref && this.ref.current && (this.props.setFocus || this.props.autoFocus)) {
            this.ref.current.focus();
        }
    }

    private readonly handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        const enterKeyCode = 13;
        const keyCode = event.keyCode || event.which;
        const {onEnterKey} = this.props;
        if (keyCode === enterKeyCode && typeof onEnterKey === 'function') {
            onEnterKey();
        }
    }

    private readonly handleValueChange = (event: ChangeEvent<HTMLInputElement>) => {
        const {onChange} = this.props;
        if (onChange) {
            onChange(event.target.value);
        }
    }

    public render(): JSX.Element {
        const {
            placeholder,
            className,
            theme,
            containerClassName,
            disabled,
            type,
            ...restProps
        } = this.props;

        const rest = omit(restProps, ['onEnterKey', 'setFocus']);
        const classNames = mergeClassNames(
            theme!.textInput,
            className,
            {
                [theme!['textInput--disabled']]: disabled
            }
        );

        return (
            <div className={containerClassName}>
                <input
                    {...rest}
                    className={classNames}
                    role="textbox"
                    aria-multiline="false"
                    aria-disabled={disabled ? 'true' : 'false'}
                    type={type}
                    placeholder={placeholder}
                    disabled={disabled}
                    onChange={this.handleValueChange}
                    onKeyPress={this.handleKeyPress}
                    ref={this.ref}
                    />
                </div>
        );
    }
}

export default TextInput;
