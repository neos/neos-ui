import React, {PropTypes} from 'react';
import mergeClassNames from 'classnames';
import style from './style.css';
import {fontAwesome} from 'Shared/Utilities/index';

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
    icon: PropTypes.string,
    // Style related propTypes.
    size: PropTypes.oneOf(['big', 'small', 'tiny']),
    padded: PropTypes.oneOf(['none', 'left', 'right']),
    className: PropTypes.string,
    spin: PropTypes.bool
};

export default Icon;
