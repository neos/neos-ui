import React, {PropTypes} from 'react';
import mergeClassNames from 'classnames';
import {makeFocusNode} from './../_lib/focusNode';

const ShallowDropDownHeader = props => {
    const {
        className,
        children,
        theme,
        isOpen,
        toggleDropDown,
        IconComponent,
        _refHandler,
        ...rest
    } = props;
    const iconName = isOpen ? 'chevron-up' : 'chevron-down';
    const finalClassName = mergeClassNames({
        [theme.dropDown__btn]: true,
        [className]: className && className.length
    });

    return (
        <button
            {...rest}
            onClick={toggleDropDown}
            ref={_refHandler(isOpen)}
            className={finalClassName}
            aria-haspopup="true"
            >
            {children}
            <IconComponent icon={iconName} className={theme.dropDown__chevron}/>
        </button>
    );
};
ShallowDropDownHeader.propTypes = {
    /**
     * An optional `className` to attach to the wrapper.
     */
    className: PropTypes.string,

    /**
     * The contents to be rendered within the header.
     */
    children: PropTypes.node,

    /**
     * An optional css theme to be injected.
     */
    theme: PropTypes.shape({// eslint-disable-line quote-props
        'dropDown__btn': PropTypes.string,
        'dropDown__btnLabel': PropTypes.string,
        'dropDown__chevron': PropTypes.string
    }).isRequired,

    /**
     * Static component dependencies which are injected from the outside (index.js)
     */
    IconComponent: PropTypes.any.isRequired,

    /**
     * These props control the visual state of the contents, and are passed
     * from the outside via the `ContextDropDownHeader` component.
     */
    isOpen: PropTypes.bool.isRequired,
    toggleDropDown: PropTypes.func.isRequired,

    /**
     * An interal prop for testing purposes, do not set this prop manually.
     */
    _refHandler: PropTypes.func
};
ShallowDropDownHeader.defaultProps = {
    _refHandler: makeFocusNode
};

export default ShallowDropDownHeader;
