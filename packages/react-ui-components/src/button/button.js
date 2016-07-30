import React, {PropTypes} from 'react';
import mergeClassNames from 'classnames';
import executeCallback from './../_lib/executeCallback.js';

const Button = props => {
    const {
        children,
        className,
        isPressed,
        isFocused,
        isDisabled,
        isActive,
        onClick,
        onMouseDown,
        onMouseUp,
        onMouseEnter,
        onMouseLeave,
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
        onClick: e => executeCallback({e, cb: onClick}),
        onMouseDown: e => executeCallback({e, cb: onMouseDown}),
        onMouseUp: e => executeCallback({e, cb: onMouseUp}),
        onMouseEnter: e => executeCallback({e, cb: onMouseEnter}),
        onMouseLeave: e => executeCallback({e, cb: onMouseLeave}),
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
    isPressed: PropTypes.bool,
    // ARIA & UI related propTypes.
    isFocused: PropTypes.bool,
    isDisabled: PropTypes.bool,
    isActive: PropTypes.bool,

    // Style related propTypes.
    style: PropTypes.oneOf(['clean', 'brand', 'lighter', 'transparent']),
    hoverStyle: PropTypes.oneOf(['clean', 'brand', 'darken']),
    className: PropTypes.string,

    // Interaction related propTypes.
    onClick: PropTypes.func.isRequired,
    onMouseDown: PropTypes.func,
    onMouseUp: PropTypes.func,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,

    // Contents of the Button.
    children: PropTypes.node.isRequired,
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
