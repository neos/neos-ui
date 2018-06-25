import React from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'classnames';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import mapper from './mapper';

const Icon = props => {
    const {size, padded, theme, label, icon, className, ...rest} = props;
    const iconClassName = icon;
    const classNames = mergeClassNames({
        [theme.icon]: true,
        [iconClassName]: true,
        [props.className]: className && className.length,
        [theme['icon--big']]: size === 'big',
        [theme['icon--medium']]: size === 'medium',
        [theme['icon--small']]: size === 'small',
        [theme['icon--tiny']]: size === 'tiny',
        [theme['icon--paddedLeft']]: padded === 'left',
        [theme['icon--paddedRight']]: padded === 'right'
    });

    const mappedIcon = mapper(icon);
    const iconArray = mappedIcon.split(' ');
    let theIcon = mappedIcon;
    let prefix = 'fas';
    if (iconArray.length > 1) {
        prefix = iconArray[0];
        const iconClass = iconArray[1];
        if (iconClass.startsWith('fa-')) {
            theIcon = iconClass.substr(3);
        } else {
            theIcon = iconClass;
        }
    }

    return <FontAwesomeIcon icon={[prefix, theIcon] || 'question'} aria-label={label} className={classNames} {...rest} />;
};
Icon.propTypes = {

    /**
     * We use the react component FortAwesome provides to render icons.
     * we will pass down all props to the component via {...rest} to expose it's api
     * https://github.com/FortAwesome/react-fontawesome/blob/master/README.md
     */

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
