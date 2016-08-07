import React, {PropTypes} from 'react';
import mergeClassNames from 'classnames';

const IconButton = props => {
    const {
        IconComponent,
        ButtonComponent,
        className,
        theme,
        icon,
        ...rest
    } = props;
    const finalClassName = mergeClassNames(theme.iconButton, className);

    return (
        <ButtonComponent {...rest} className={finalClassName}>
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
    * An optional css theme to be injected.
    */
    theme: PropTypes.shape({// eslint-disable-line quote-props
        'iconButton': PropTypes.string
    }).isRequired,

    /**
     * Static component dependencies which are injected from the outside (index.js)
     */
    IconComponent: PropTypes.any.isRequired,
    ButtonComponent: PropTypes.any.isRequired
};
IconButton.defaultProps = {
    style: 'transparent',
    hoverStyle: 'brand'
};

export default IconButton;
