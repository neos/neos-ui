import mergeClassNames from 'classnames';
import React, {PureComponent} from 'react';
import { ReactSVG } from 'react-svg';

import {IconProps, IconTheme, defaultProps} from './icon';
import {Omit} from '../../types';

interface ResourceIconTheme extends IconTheme {
    readonly 'icon--resource': string;
}

export interface ResourceIconProps extends Omit<IconProps, 'theme'> {
    readonly theme?: ResourceIconTheme;
}

class ResourceIcon extends PureComponent<ResourceIconProps> {
    public static readonly defaultProps = defaultProps;

    public render(): JSX.Element | null {
        const {padded, theme, label, icon, className, color, size} = this.props;

        if (!icon || icon.substr(0, 11) !== 'resource://') {
            return null;
        }

        const iconResourcePath = '/_Resources/Static/Packages/' + icon.substr(11);
        const classNames = mergeClassNames(
            theme!.icon,
            className,
            {
                [theme!['icon--resource']]: icon,
                [theme!['icon--paddedLeft']]: padded === 'left',
                [theme!['icon--paddedRight']]: padded === 'right',
                [theme!['icon--color-warn']]: color === 'warn',
                [theme!['icon--color-error']]: color === 'error',
                [theme!['icon--color-primaryBlue']]: color === 'primaryBlue',
                [theme!['icon--huge']]: size === '2x',
                [theme!['icon--big']]: size === 'lg',
                [theme!['icon--small']]: size === 'sm',
                [theme!['icon--tiny']]: size === 'xs'
            }
        );

        return <ReactSVG src={iconResourcePath} aria-label={label} className={classNames} wrapper="span" />;
    }
}

export default ResourceIcon;
