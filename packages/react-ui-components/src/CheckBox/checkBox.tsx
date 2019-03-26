import mergeClassNames from 'classnames';
import React, {PureComponent} from 'react';
import {Omit} from '../../types';
import Icon from './../Icon';

interface CheckBoxTheme {
    readonly checkbox: string;
    readonly checkbox__checked: string;
    readonly checkbox__disabled: string;
    readonly checkbox__input: string; // eslint-disable-line
    readonly checkbox__inputMirror: string; // eslint-disable-line
    readonly 'checkbox__inputMirror--active': string;
    readonly checkbox__icon: string;
}

type HTMLInputElementAttributesExceptOnChange = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>;

export interface CheckBoxProps extends HTMLInputElementAttributesExceptOnChange {
    /**
     * This prop controls the visual active state of the CheckBox.
     */
    readonly isChecked: boolean;

    /**
     * This prop controls if the CheckBox is disabled or not.
     */
    readonly disabled?: boolean;

    /**
     * An optional `className` to attach to the wrapper.
     */
    readonly className?: string;

    /**
     * An optional change handler which gets called once the user clicks on the CheckBox.
     */
    readonly onChange?: (isChecked: boolean) => void;

    /**
     * An optional css theme to be injected.
     */
    readonly theme: CheckBoxTheme;
}

class CheckBox extends PureComponent<CheckBoxProps> {
    public render(): JSX.Element {
        const {
            isChecked,
            disabled,
            className,
            theme,
            ...rest
        } = this.props;
        const finalClassName = mergeClassNames(
            className,
            theme.checkbox,
            {
                [theme.checkbox__checked]: isChecked,
                [theme.checkbox__disabled]: disabled,
            }
        );
        const mirrorClassNames = mergeClassNames(
            theme.checkbox__inputMirror,
            {
                [theme['checkbox__inputMirror--active']]: isChecked,
            }
        );

        return (
            <div className={finalClassName}>
                <input
                    {...rest}
                    className={theme.checkbox__input}
                    type="checkbox"
                    checked={isChecked}
                    aria-checked={isChecked}
                    onChange={this.handleChange}
                    disabled={disabled}
                    />
                <Icon
                    className={theme.checkbox__icon}
                    icon="check"
                    />
                <div className={mirrorClassNames}/>
            </div>
        );
    }

    private readonly handleChange = () => {
        const {onChange, isChecked} = this.props;

        if (onChange) {
            onChange(!isChecked);
        }
    }
}

export default CheckBox;
