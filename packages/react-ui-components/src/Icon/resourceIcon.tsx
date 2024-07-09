import mergeClassNames from 'classnames';
import React, {PureComponent} from 'react';
import {ReactSVG} from 'react-svg';

import {defaultProps} from './iconDefaultProps';
import {IconProps, IconTheme} from './icon';
import {
    getRedirectForPublicPackageResourceUriByPath,
    isResourceProtocol,
    normaliseLegacyResourcePath
} from '../resourceStreamWrapper';

interface ResourceIconTheme extends IconTheme {
    readonly 'icon--resource': string;
}

export interface ResourceIconProps extends Omit<IconProps, 'theme'> {
    readonly theme?: ResourceIconTheme;
}

class ResourceIcon extends PureComponent<ResourceIconProps> {
    public static readonly defaultProps = defaultProps;

    public render(): JSX.Element | null {
        const {padded, theme, label, icon, className, color, size} = this.props;

        if (!icon || !isResourceProtocol(icon)) {
            return null;
        }

        const iconResourcePath = getRedirectForPublicPackageResourceUriByPath(
            normaliseLegacyResourcePath(icon)
        );
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
                [theme!['icon--huge']]: size === '3x',
                [theme!['icon--large']]: size === '2x',
                [theme!['icon--big']]: size === 'lg',
                [theme!['icon--small']]: size === 'sm',
                [theme!['icon--tiny']]: size === 'xs'
            }
        );

        return <ReactSVG src={iconResourcePath} aria-label={label} className={classNames} wrapper="span" />;
    }
}

export default ResourceIcon;
