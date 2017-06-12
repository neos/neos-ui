import React from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'classnames';

const ShallowDropDownContents = props => {
    const {
        className,
        children,
        theme,
        isOpen,
        closeDropDown,
        ...rest
    } = props;
    const finalClassName = mergeClassNames({
        [className]: className && className.length,
        [theme.dropDown__contents]: true,
        [theme['dropDown__contents--isOpen']]: isOpen
    });

    return (
        <ul
            {...rest}
            className={finalClassName}
            aria-hidden={isOpen ? 'false' : 'true'}
            aria-label="dropdown"
            role="button"
            onClick={closeDropDown}
            >
            {children}
        </ul>
    );
};
ShallowDropDownContents.propTypes = {
    /**
     * An optional `className` to attach to the wrapper.
     */
    className: PropTypes.string,

    /**
     * The contents to be rendered within the contents wrapper.
     */
    children: PropTypes.any.isRequired,

    /**
     * An optional css theme to be injected.
     */
    theme: PropTypes.shape({// eslint-disable-line quote-props
        'dropDown__contents': PropTypes.string,
        'dropDown__contents--isOpen': PropTypes.string
    }).isRequired,

    /**
     * These props control the visual state of the contents, and are passed
     * from the outside via the `ContextDropDownContents` component.
     */
    isOpen: PropTypes.bool.isRequired,
    closeDropDown: PropTypes.func.isRequired
};

export default ShallowDropDownContents;
