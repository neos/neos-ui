import React, {PropTypes} from 'react';
import mergeClassNames from 'classnames';
import {makeFocusNode} from './../_lib/focusNode';

const validStyleKeys = ['clean', 'brand', 'lighter', 'transparent', 'warn'];
const validHoverStyleKeys = ['clean', 'brand', 'darken', 'warn'];

const Button = props => {
    const {
        children,
        className,
        isPressed,
        isFocused,
        isDisabled,
        isActive,
        style,
        hoverStyle,
        size,
        theme,
        _refHandler,
        onClick
    } = props;
    const effectiveStyle = isActive ? 'brand' : style;
    const effectiveHoverStyle = isActive ? 'brand' : hoverStyle;
    const finalClassName = mergeClassNames({
        [theme.btn]: true,
        [theme[`btn--size-${size}`]]: true,
        [theme[`btn--${effectiveStyle}`]]: validStyleKeys.includes(effectiveStyle),
        [theme[`btn--${effectiveHoverStyle}Hover`]]: validStyleKeys.includes(effectiveHoverStyle),
        [theme['btn--brandActive']]: isActive,
        [theme['btn--isPressed']]: isPressed,
        [className]: className && className.length
    });

    const attributes = {
        className: finalClassName,
        role: 'button',
        ref: _refHandler(isFocused),
        onClick
    };

    //
    // Disable the btn if `isDisabled` prop is truthy.
    //
    if (isDisabled) {
        attributes.disabled = 'disabled';
    }

    return (
        <button {...attributes}>
            {children}
        </button>
    );
};
Button.propTypes = {
    /**
     * This prop controls the visual pressed state of the `Button`.
     */
    isPressed: PropTypes.bool,

    /**
     * This prop controls the visual focused state of the `Button`.
     * When `true`, the node gets focused via the DOM API.
     */
    isFocused: PropTypes.bool,

    /**
     * This prop controls the visual and interactive disabled state of the `Button`.
     * When `true`, the node gets rendered with a truthy `disabled` prop.
     */
    isDisabled: PropTypes.bool,

    /**
     * This prop controls the visual active state of the `Button`.
     */
    isActive: PropTypes.bool,

    /**
     * The `style` prop defines the regular visual style of the `Button`.
     */
    style: PropTypes.oneOf(validStyleKeys),

    /**
     * As the `style` prop, this prop controls the visual :hover style of the `Button`.
     */
    hoverStyle: PropTypes.oneOf(validHoverStyleKeys),

    /**
     * Defines the size of the button.
     */
    size: PropTypes.oneOf(['small', 'regular']),

    /**
     * An optional `className` to attach to the wrapper.
     */
    className: PropTypes.string,

    /**
     * The contents to be rendered within the `Bar`.
     */
    children: PropTypes.any.isRequired,

    /**
     * An optional css theme to be injected.
     */
    theme: PropTypes.shape({
        'btn': PropTypes.string,
        'btn--clean': PropTypes.string,
        'btn--lighter': PropTypes.string,
        'btn--transparent': PropTypes.string,
        'btn--brand': PropTypes.string,
        'btn--brandHover': PropTypes.string,
        'btn--cleanHover': PropTypes.string,
        'btn--isPressed': PropTypes.string,
        'btn--darkenHover': PropTypes.string
    }).isRequired,

    onClick: PropTypes.func,

    /**
     * An interal prop for testing purposes, do not set this prop manually.
     */
    _refHandler: PropTypes.func
};
Button.defaultProps = {
    style: '',
    hoverStyle: 'brand',
    size: 'regular',
    isFocused: false,
    isDisabled: false,
    isActive: false,
    _refHandler: makeFocusNode
};

export default Button;
