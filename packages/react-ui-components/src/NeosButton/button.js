import React, { PropTypes } from 'react';
import mergeClassNames from 'classnames';
import { makeFocusNode } from './../_lib/focusNode';

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
        variant,
        _refHandler,
        ...rest
    } = props;
    const effectiveStyle = isActive ? 'brand' : style;
    const effectiveHoverStyle = isActive ? 'brand' : hoverStyle;
    const finalClassName = mergeClassNames({
        [theme['btn--content']]: true,
        [theme[`btn--size-${size}`]]: true,
        [theme[`btn--${effectiveStyle}`]]: validStyleKeys.includes(effectiveStyle),
        [theme[`btn--${effectiveHoverStyle}Hover`]]: validStyleKeys.includes(effectiveHoverStyle),
        [theme['btn--brandActive']]: isActive,
        [theme['btn--isPressed']]: isPressed,
        [className]: className && className.length
    });
    const attributes = {};

    //
    // Disable the btn if `isDisabled` prop is truthy.
    //
    if (isDisabled) {
        attributes.disabled = 'disabled';
    }

    const buttonClassName = {
        base: theme.btn,
        corner: theme['btn--corner--fill--' + variant],
        topCorner: theme['btn--corner'] + ' ' + theme['btn--corner--top'],
        bottomCorner: theme['btn--corner'] + ' ' + theme['btn--corner--bottom']
    };

    return (
        <button {...rest} {...attributes} className={buttonClassName.base} role="button" ref={_refHandler(isFocused)}>
            <div className={buttonClassName.topCorner}>
              <svg xmlns="http://www.w3.org/2000/svg" version="1.1" id="Layer_1" x="0px" y="0px" width="14px" height="10px" viewBox="0 0 14 10" enableBackground="new 0 0 14 10" xmlSpace="preserve">
                <polygon className={buttonClassName.corner} xmlns="http://www.w3.org/2000/svg" strokeMiterlimit="10" points="0,0 0,10 14,0"></polygon>
                <line strokeMiterlimit="10" x1="0" y1="10" x2="14" y2="0"></line>
              </svg>
            </div>
            <div className={finalClassName}>{children}</div>
            <div className={buttonClassName.bottomCorner}>
              <svg xmlns="http://www.w3.org/2000/svg" version="1.1" id="Layer_1" x="0px" y="0px" width="14px" height="10px" viewBox="0 0 14 10" enableBackground="new 0 0 14 10" xmlSpace="preserve">
                <polygon className={buttonClassName.corner} xmlns="http://www.w3.org/2000/svg" strokeMiterlimit="10" points="14,10 0,10 14,0"></polygon>
                <line strokeMiterlimit="10" x1="0" y1="10" x2="14" y2="0"></line>
              </svg>
            </div>
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

    variant: PropTypes.string,

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

    /**
     * An interal prop for testing purposes, do not set this prop manually.
     */
    _refHandler: PropTypes.func
};
Button.defaultProps = {
    style: '',
    hoverStyle: 'brand',
    variant: 'darkest',
    size: 'regular',
    isFocused: false,
    isDisabled: false,
    isActive: false,
    _refHandler: makeFocusNode
};

export default Button;
