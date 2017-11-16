import React from 'react';
import PropTypes from 'prop-types';
import mergeClassNames from 'classnames';

const cachedWarnings = [];
export const iconPropValidator = (props, propName) => {// eslint-disable-line consistent-return
    const {onDeprecate, _makeValidateId, iconMap} = props;
    const validateId = _makeValidateId(iconMap);
    const id = props[propName];
    const {isValid, isMigrationNeeded, iconName} = validateId(id);
    const isInvalid = isValid === false;
    const isNotAlreadyThrown = cachedWarnings.includes(iconName) === false;

    if (isInvalid && isNotAlreadyThrown) {
        cachedWarnings.push(iconName);

        if (isMigrationNeeded && iconName && onDeprecate) {
            onDeprecate(`Font-Awesome has been updated. The icon name "${id}" has been renamed.

Please adjust the icon configurations in your .yaml files to the new icon name "${iconName}".

https://github.com/FortAwesome/Font-Awesome/wiki/Upgrading-from-3.2.1-to-4`);
        } else if (!iconName) {
            return new Error(`Icon name "${id}" was not a found in Font-Awesome 4.5.
Please use the icon names from the Font-Awesome website.

http://fortawesome.github.io/Font-Awesome/icons/`);
        }
    }
};

const Icon = props => {
    const {size, padded, theme, iconMap, label, _makeGetClassName, ...rest} = props;
    const getClassName = _makeGetClassName(iconMap);
    const iconClassName = getClassName(props.icon);
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

    return <icon {...rest} role="img" aria-label={label} className={classNames}/>;
};
Icon.propTypes = {
    /**
     * The ID of the icon to render.
     */
    icon: iconPropValidator,

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
    }).isRequired,

    /**
     * The css modules map of the Font-Awesome stylesheet.
     */
    iconMap: PropTypes.object.isRequired,

    /**
     * A function which gets called once a deprecation warning should be displayed.
     */
    onDeprecate: PropTypes.func,
    _makeValidateId: PropTypes.func.isRequired,
    _makeGetClassName: PropTypes.func.isRequired
};

export default Icon;
