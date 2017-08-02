import React from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'classnames';

const IconButton = props => {
    const {
        IconComponent,
        ButtonComponent,
        className,
        theme,
        icon,
        size,
        disabled,
        ...rest
    } = props;
    const finalClassName = mergeClassNames({
        [className]: className && className.length,
        [theme.iconButton]: true,
        [theme[`size-${size}`]]: true,
        [theme['iconButton--disabled']]: disabled
    });

    return (
        <ButtonComponent {...rest} size={size} className={finalClassName}>
            <IconComponent icon={icon}/>
        </ButtonComponent>
    );
};
IconButton.propTypes = {
    /**
     * The icon key which gets passed to the Icon Component.
     */
    icon: PropTypes.string.isRequired,

    /**
     * An optional `className` to attach to the wrapper.
     */
    className: PropTypes.string,

    /**
     * Defines the size of the icon button.
     */
    size: PropTypes.oneOf(['small', 'regular']),

    /**
    * An optional css theme to be injected.
    */
    theme: PropTypes.shape({/* eslint-disable quote-props */
        'iconButton': PropTypes.string
    }).isRequired, /* eslint-enable quote-props */

    /**
     * Static component dependencies which are injected from the outside (index.js)
     */
    IconComponent: PropTypes.any.isRequired,
    ButtonComponent: PropTypes.any.isRequired,

    /**
     * Optional disabled flag
     */
    disabled: PropTypes.bool
};
IconButton.defaultProps = {
    size: 'regular',
    style: 'transparent',
    hoverStyle: 'brand'
};

export default IconButton;
