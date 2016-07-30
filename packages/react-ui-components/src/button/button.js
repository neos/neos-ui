import React, {PropTypes} from 'react';
import mergeClassNames from 'classnames';

const Button = props => {
    const {
        children,
        className,
        isPressed,
        isFocused,
        isDisabled,
        isActive,
        style,
        theme,
        hoverStyle,
        ...rest
    } = props;
    const effectiveStyle = isActive ? 'brand' : style;
    const effectiveHoverStyle = isActive ? 'brand' : hoverStyle;
    const classNames = mergeClassNames({
        [theme.btn]: true,
        [theme['btn--clean']]: effectiveStyle === 'clean',
        [theme['btn--lighter']]: effectiveStyle === 'lighter',
        [theme['btn--transparent']]: effectiveStyle === 'transparent',
        [theme['btn--brand']]: effectiveStyle === 'brand',
        [theme['btn--cleanHover']]: effectiveHoverStyle === 'clean',
        [theme['btn--brandHover']]: effectiveHoverStyle === 'brand',
        [theme['btn--darkenHover']]: effectiveHoverStyle === 'darken',
        [theme['btn--brandActive']]: isActive,
        [theme['btn--isPressed']]: isPressed,
        [className]: className && className.length
    });
    const attributes = {
        className: classNames,
        ref: btn => {
            const method = isFocused ? 'focus' : 'blur';

            //
            // Initially focus the btn if the propType was set.
            //
            if (btn !== null) {
                btn[method]();
            }
        }
    };

    //
    // Disable the btn if the prop was set.
    //
    if (isDisabled) {
        attributes.disabled = 'disabled';
    }

    return (
        <button {...rest} {...attributes} role="button">
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
    style: PropTypes.oneOf(['clean', 'brand', 'lighter', 'transparent']),

    /**
     * As the `style` prop, this prop controls the visual :hover style of the `Button`.
     */
    hoverStyle: PropTypes.oneOf(['clean', 'brand', 'darken']),

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
    }).isRequired
};
Button.defaultProps = {
    style: '',
    hoverStyle: 'brand',
    isFocused: false,
    isDisabled: false,
    isActive: false
};

export default Button;
