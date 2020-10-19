import mergeClassNames from 'classnames';
import React from 'react';

import {Omit, PickDefaultProps} from '../../types';
import {makeFocusNode} from '../_lib/focusNode';

export type ButtonStyle = 'clean' | 'brand' | 'lighter' | 'neutral' | 'transparent' | 'success' | 'warn' | 'error';
export type ButtonHoverStyle = 'clean' | 'brand' | 'darken' | 'success' | 'warn' | 'error';
export type ButtonSize = 'small' | 'regular';

interface ButtonTheme {
    readonly 'btn': string;
    readonly 'btn--clean': string;
    readonly 'btn--lighter': string;
    readonly 'btn--transparent': string;
    readonly 'btn--brand': string;
    readonly 'btn--brandActive': string;
    readonly 'btn--brandHover': string;
    readonly 'btn--cleanHover': string;
    readonly 'btn--isPressed': string;
    readonly 'btn--darkenHover': string;
}

// We omit the standard HTML button style attribute,
// so we have no collision with the Button component's style property,
// while still enjoying the intellisense and type checking for the rest of the HTML button attributes
export type HTMLButtonElementAttributesExceptStyle = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'style'>;

// own props and (optional) HTML button attributes except 'style'
export interface ButtonProps extends HTMLButtonElementAttributesExceptStyle {
    /**
     * This prop controls the visual pressed state of the `Button`.
     */
    readonly isPressed?: boolean;

    /**
     * This prop controls the visual focused state of the `Button`.
     * When `true`, the node gets focused via the DOM API.
     */
    readonly isFocused?: boolean;

    /**
     * This prop controls the visual and interactive disabled state of the `Button`.
     * When `true`, the node gets rendered with a truthy `disabled` prop.
     */
    readonly disabled?: boolean;

    /**
     * This prop controls the visual active state of the `Button`.
     */
    readonly isActive?: boolean;

    /**
     * The `kind` prop defines the regular visual style of the `Button`.
     */
    readonly style?: ButtonStyle;

    /**
     * As the `style` prop, this prop controls the visual :hover style of the `Button`.
     */
    readonly hoverStyle?: ButtonHoverStyle;

    /**
     * Defines the size of the button.
     */
    readonly size?: ButtonSize;

    /**
     * An optional `className` to attach to the wrapper.
     */
    readonly className?: string;

    /**
     * The contents to be rendered within the `Bar`.
     */
    readonly children: React.ReactNode;

    /**
     * An optional css theme to be injected.
     */
    readonly theme?: ButtonTheme;

    /**
     * An interal prop for testing purposes, do not set this prop manually.
     */
    readonly _refHandler?: (isFocused: boolean) => (node: any) => void;
}

type DefaultProps = PickDefaultProps<ButtonProps,
    '_refHandler' |
    'hoverStyle' |
    'isActive' |
    'disabled' |
    'isFocused' |
    'size' |
    'style' |
    'type'
>;

export const defaultProps: DefaultProps = {
    _refHandler: makeFocusNode,
    hoverStyle: 'brand',
    isActive: false,
    disabled: false,
    isFocused: false,
    size: 'regular',
    style: 'lighter',
    type: 'button',
};

class Button extends React.PureComponent<ButtonProps> {
    public static readonly defaultProps = defaultProps;

    private getDisabled(): boolean {
        return Boolean(this.props.disabled);
    }

    public render(): JSX.Element {
        const {
            children,
            className,
            isPressed,
            isFocused,
            isActive,
            style,
            hoverStyle,
            size,
            theme,
            type,
            _refHandler,
            ...rest
        } = this.props;
        const disabled = this.getDisabled();
        const effectiveStyle = isActive ? 'brand' : style;
        const effectiveHoverStyle = isActive ? 'brand' : hoverStyle;
        const finalClassName = mergeClassNames(
            theme!.btn,
            // @ts-ignore implizit any because ButtonTheme has no index signature
            theme![`btn--size-${size}`],
            // @ts-ignore implizit any because ButtonTheme has no index signature
            theme![`btn--${effectiveStyle!}`],
            // @ts-ignore implizit any because ButtonTheme has no index signature
            theme![`btn--${effectiveHoverStyle!}Hover`],
            {
                [theme!['btn--brandActive']]: isActive,
                [theme!['btn--isPressed']]: isPressed,
            },
            className,
        );

        return (
            <button {...rest} disabled={disabled} type={type} className={finalClassName} role="button" ref={_refHandler && _refHandler(isFocused!)}>
                {children}
            </button>
        );
    }
}

export default Button;
