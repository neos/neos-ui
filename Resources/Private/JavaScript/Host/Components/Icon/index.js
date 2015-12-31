import React, {Component, PropTypes} from 'react';
import mergeClassNames from 'classnames';
import {service} from '../../../Shared/';
import style from './style.css';
import iconStyles from './icons.css';
import {
  validateIconId
} from './IconNames.js';
const {logger} = service;

export default class Icon extends Component {
    static propTypes = {
        // The icon key of Font-Awesome.
        icon(props, propName) {
            const id = props[propName];
            const {isValid, isMigrated, iconName} = validateIconId(id);

            if (!isValid) {
                if (isMigrated && iconName) {
                    logger.warn(`Font-Awesome has been updated. The icon name "${id}" has been renamed.

Please adjust the icon configurations in your .yaml files to the new icon name "${iconName}".

https://github.com/FortAwesome/Font-Awesome/wiki/Upgrading-from-3.2.1-to-4`);
                } else {
                    return new Error(`Icon name "${id}" was not a found in Font-Awesome 4.5.
Please use the icon names from the Font-Awesome website.

http://fortawesome.github.io/Font-Awesome/icons/`);
                }
            }
        },

        // Style related propTypes.
        size: PropTypes.oneOf(['big', 'small', 'tiny']),
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
        const {iconName} = validateIconId(this.props.icon);

        return iconStyles[iconName];
    }
}
