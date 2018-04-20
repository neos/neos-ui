import React from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'classnames';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

const Icon = props => {
    const {size, padded, theme, label} = props;
    const iconClassName = props.icon;
    const classNames = mergeClassNames({
        [theme.icon]: true,
        [iconClassName]: true,
        [props.className]: props.className && props.className.length,
        [theme['icon--big']]: size === 'big',
        [theme['icon--medium']]: size === 'medium',
        [theme['icon--small']]: size === 'small',
        [theme['icon--tiny']]: size === 'tiny',
        [theme['icon--paddedLeft']]: padded === 'left',
        [theme['icon--paddedRight']]: padded === 'right',
        [theme['icon--spin']]: props.spin
    });

    const iconArray = props.icon.split(' ');
    let icon = props.icon;
    let prefix = 'fas';
    if (iconArray.length > 1) {
        prefix = iconArray[0];
        const iconClass = iconArray[1];
        if (iconClass.startsWith('fa-')) {
            icon = iconClass.substr(3);
        } else {
            icon = iconClass;
        }
    }

    return <FontAwesomeIcon icon={[prefix, icon] || 'question'} aria-label={label} className={classNames} />;
};
Icon.propTypes = {
    /**
     * The ID of the icon to render.
     */
    icon: PropTypes.string,

    /**
     * The (accessibility) label for this icon
     */
    label: PropTypes.string,

    /**
     * Controls the rendered size of the icon.
     */
    size: PropTypes.oneOf(['big', 'medium', 'small', 'tiny']),

    /**
     * Controls the padding around the icon in a standardized way.
     */
    padded: PropTypes.oneOf(['none', 'left', 'right']),

    /**
     * An optional `className` to attach to the wrapper.
     */
    className: PropTypes.string,

    /**
     * When truthy, the icon will spin continously.
     */
    spin: PropTypes.bool,

    /**
    * An optional css theme to be injected.
    */
    theme: PropTypes.shape({
        'icon': PropTypes.string,
        'icon--big': PropTypes.string,
        'icon--small': PropTypes.string,
        'icon--tiny': PropTypes.string,
        'icon--paddedLeft': PropTypes.string,
        'icon--paddedRight': PropTypes.string,
        'icon--spin': PropTypes.string
    }).isRequired
};

export default Icon;
