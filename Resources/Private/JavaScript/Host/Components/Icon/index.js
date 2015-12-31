import React, {Component, PropTypes} from 'react';
import mergeClassNames from 'classnames';
import {service} from '../../../Shared/';
import style from './style.css';
import iconStyles from './icons.css';
import {
  ICON_NAMES,
  DEPRECATED_ICON_NAMES
} from './IconNames.js';
const {logger} = service;

export default class Icon extends Component {
    static propTypes = {
        size: PropTypes.oneOf(['big', 'regular', 'small', 'tiny']).isRequired,
        icon(props, propName) {
            const val = props[propName];

            // First of, we want to check if the passed value is a deprecated icon name.
            if (DEPRECATED_ICON_NAMES.indexOf(val) > -1) {
                logger.warn(`Font-Awesome has been updated. The icon name "${val}" has been updated/removed.
Please adjust your icon configurations in your .yaml files to the new name-scheme of Font-Awesome 4.5.`);
            } else if (
              // Afterwards, check if the passed value is in the list of available icons...
              ICON_NAMES.indexOf(val) === -1 &&

              // ... or if it is available but needs the Font-Awesome prefix.
              ICON_NAMES.indexOf(`fa-${val}`) === -1
            ) {
                return new Error(`Icon name "${val}" is not a valid icon name in Font-Awesome 4.5.
Please use the icon names from http://fortawesome.github.io/Font-Awesome/icons/.`);
            }
        },
        padded: PropTypes.oneOf(['none', 'left', 'right']),
        className: PropTypes.string
    }

    render() {
        const {size, padded} = this.props;
        const iconClassName = this.getIconClassName();
        const classNames = mergeClassNames({
            [style.icon]: true,
            [iconClassName]: true,
            [this.props.className]: Boolean(this.props.className),
            [style['icon--big']]: size === 'big',
            [style['icon--small']]: size === 'small',
            [style['icon--tiny']]: size === 'tiny',
            [style['icon--paddedLeft']]: padded === 'left',
            [style['icon--paddedRight']]: padded === 'right'
        });

        return (
            <i className={classNames}></i>
        );
    }

    getIconClassName() {
        const {icon} = this.props;

        return iconStyles[icon] || iconStyles[`fa-${icon}`] || iconStyles[icon.replace('icon-', 'fa-')];
    }
}
Icon.defaultProps = {
    size: 'regular'
};
