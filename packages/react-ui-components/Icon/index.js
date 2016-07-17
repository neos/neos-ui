import React, {PropTypes} from 'react';
import mergeClassNames from 'classnames';
import {service} from 'Shared/index';
import style from './style.css';
import {api, fontAwesome} from 'Shared/Utilities/';
const {logger} = service;

const cachedWarnings = {};

const Icon = props => {
    const {size, padded} = props;
    const iconClassName = fontAwesome.getClassName(props.icon);
    const classNames = mergeClassNames({
        [style.icon]: true,
        [iconClassName]: true,
        [props.className]: props.className && props.className.length,
        [style['icon--big']]: size === 'big',
        [style['icon--small']]: size === 'small',
        [style['icon--tiny']]: size === 'tiny',
        [style['icon--paddedLeft']]: padded === 'left',
        [style['icon--paddedRight']]: padded === 'right',
        [style['icon--spin']]: props.spin
    });

    return (
        <i className={classNames}></i>
    );
};
Icon.propTypes = {
    // The icon key of Font-Awesome.
    icon(props, propName) {//eslint-disable-line
        const id = props[propName];
        const {isValid, isMigrationNeeded, iconName} = fontAwesome.validateId(id);
        const {systemEnv} = api.get();

        //
        // ToDo: In the future we need to adjust the `systemEnv`
        // condition to throw warnings in Development, but not in Production.
        // For now we disable these warnings in development since they
        // make debugging a mess.
        //
        if (!isValid && systemEnv !== 'Development') {
            if (isMigrationNeeded && iconName && !cachedWarnings[iconName]) {
                cachedWarnings[iconName] = true;
                logger.warn(`Font-Awesome has been updated. The icon name "${id}" has been renamed.

Please adjust the icon configurations in your .yaml files to the new icon name "${iconName}".

https://github.com/FortAwesome/Font-Awesome/wiki/Upgrading-from-3.2.1-to-4`);
            } else if (!iconName || !cachedWarnings[iconName]) {
                return new Error(`Icon name "${id}" was not a found in Font-Awesome 4.5.
Please use the icon names from the Font-Awesome website.

http://fortawesome.github.io/Font-Awesome/icons/`);
            }
        }
    },

    // Style related propTypes.
    size: PropTypes.oneOf(['big', 'small', 'tiny']),
    padded: PropTypes.oneOf(['none', 'left', 'right']),
    className: PropTypes.string,
    spin: PropTypes.bool
};

export default Icon;
