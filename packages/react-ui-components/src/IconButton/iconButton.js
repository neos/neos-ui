import React from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'classnames';
import Tooltip from './../Tooltip/index.js';

const IconButton = props => {
    const {
        IconComponent,
        ButtonComponent,
        tooltipLabel,
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

    // generate a randon identifer for each tooltip wich is rendered
    const tooltipIdentifier = Math.random().toString(36).substring(7);
    const tooltipData = {'data-tip': '', 'data-for': tooltipIdentifier};

    return (
        <ButtonComponent {...rest} {...tooltipData} size={size} className={finalClassName}>
            <IconComponent icon={icon}/>
            {tooltipIdentifier && <Tooltip id={tooltipIdentifier}>{tooltipLabel}</Tooltip>}
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
     * The content shwon inside the tooltip wich appears on mouse over. Can
     * either be a simple string or other components
     */
    tooltipLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),

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
