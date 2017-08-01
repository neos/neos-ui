import React from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'classnames';
import {makeFocusNode} from './../_lib/focusNode';

const emptyFn = () => null;

const ShallowDropDownHeader = props => {
    const {
        className,
        children,
        theme,
        isOpen,
        toggleDropDown,
        IconComponent,
        _refHandler,
        shouldKeepFocusState,
        disabled,
        ...rest
    } = props;
    const iconName = isOpen ? 'chevron-up' : 'chevron-down';
    const finalClassName = mergeClassNames({
        [theme.dropDown__btn]: true,
        [className]: className && className.length,
        [theme['dropDown__btn--open']]: isOpen
    });

    return (
        <div
            {...rest}
            onClick={disabled ? null : toggleDropDown }
            ref={shouldKeepFocusState ? _refHandler(isOpen) : emptyFn}
            className={finalClassName}
            aria-haspopup="true"
            >
            {children}
            <IconComponent icon={iconName} className={theme.dropDown__chevron}/>
        </div>
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
    theme: PropTypes.shape({/* eslint-disable quote-props */
        'dropDown__btn': PropTypes.string,
        'dropDown__btnLabel': PropTypes.string,
        'dropDown__chevron': PropTypes.string
    }).isRequired, /* eslint-enable quote-props */

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
    _refHandler: PropTypes.func,

    /**
     * if TRUE, will keep the focussed state of the element when re-drawing.
     * Must be set to FALSE when connected components want to manage the focus state themselves (e.g.
     * when this component is used to build a select box)
     */
    shouldKeepFocusState: PropTypes.bool,

    /**
     * Disable the onclick handler if disabled
     */
    disabled: PropTypes.bool
};
ShallowDropDownHeader.defaultProps = {
    _refHandler: makeFocusNode,
    shouldKeepFocusState: true
};

export default ShallowDropDownHeader;
