import mergeClassNames from 'classnames';
import React, {PureComponent} from 'react';
import {ReactSVG} from 'react-svg';

import {defaultProps} from './iconDefaultProps';
import {IconProps, IconTheme} from './icon';

interface ResourceIconTheme extends IconTheme {
    readonly 'icon--resource': string;
}

export interface ResourceIconProps extends Omit<IconProps, 'theme'> {
    readonly theme?: ResourceIconTheme;
}

export const ResourceIconContext = React.createContext<{createFromResourcePath:(path: string) => string} | null>(null);

class ResourceIcon extends PureComponent<ResourceIconProps> {
    public static readonly contextType = ResourceIconContext;

    context!: React.ContextType<typeof ResourceIconContext>;

    public static readonly defaultProps = defaultProps;

    public render(): JSX.Element | null {
        const {padded, theme, label, icon, className, color, size} = this.props;

        if (!this.context) {
            console.error('ResourceIconContext missing! Cannot resolve uri: ', icon);
            return null;
        }

        const regex = /^resource:\/\/([^\\/]+)\/(.*)/;

        const matches = icon?.match(regex);

        if (!matches) {
            return null;
        }
        const [_, packageName, rawPath] = matches;

        let publicPath = rawPath;
        if (!rawPath.startsWith('Public/')) {
            // legacy syntax not including the "Public" segment see https://github.com/neos/neos-ui/issues/2092#issuecomment-1606055787
            publicPath = `Public/${rawPath}`;
        }

        const resourcePath = `resource://${packageName}/${publicPath}`;

        const iconResourcePath = this.context.createFromResourcePath(resourcePath);
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
