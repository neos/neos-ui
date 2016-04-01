import React, {PropTypes} from 'react';
import mergeClassNames from 'classnames';
import {executeCallback} from 'Shared/Utilities/index';
import styles from './style.css';

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
        hoverStyle,
        ...directProps
    } = props;
    const effectiveStyle = isActive ? 'brand' : style;
    const effectiveHoverStyle = isActive ? 'brand' : hoverStyle;
    const classNames = mergeClassNames({
        [styles.btn]: true,
        [styles['btn--clean']]: effectiveStyle === 'clean',
        [styles['btn--lighter']]: effectiveStyle === 'lighter',
        [styles['btn--transparent']]: effectiveStyle === 'transparent',
        [styles['btn--brand']]: effectiveStyle === 'brand',
        [styles['btn--cleanHover']]: effectiveHoverStyle === 'clean',
        [styles['btn--brandHover']]: effectiveHoverStyle === 'brand',
        [styles['btn--darkenHover']]: effectiveHoverStyle === 'darken',
        [styles['btn--brandActive']]: isActive,
        [styles['btn--isPressed']]: isPressed,
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
        <button role="button" {...attributes} {...directProps}>
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
    children: PropTypes.node.isRequired
};
Button.defaultProps = {
    style: '',
    hoverStyle: 'brand',
    isFocused: false,
    isDisabled: false,
    isActive: false
};

export default Button;
