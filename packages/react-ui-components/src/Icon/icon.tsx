import {IconName, IconPrefix, IconProp} from '@fortawesome/fontawesome-svg-core';
import {FontAwesomeIcon, Props} from '@fortawesome/react-fontawesome';
import mergeClassNames from 'classnames';
import React, {PureComponent} from 'react';

import {PickDefaultProps, Omit} from '../../types';
import mapper from './mapper';

type IconPadding = 'none' | 'left' | 'right';
type IconColor = 'default' | 'warn' | 'error' | 'primaryBlue';

interface IconTheme {
    readonly icon: string;
    readonly 'icon--big': string;
    readonly 'icon--small': string;
    readonly 'icon--tiny': string;
    readonly 'icon--paddedLeft': string;
    readonly 'icon--paddedRight': string;
    readonly 'icon--spin': string;
    readonly 'icon--color-warn': string;
    readonly 'icon--color-error': string;
    readonly 'icon--color-primaryBlue': string;
}

export interface IconProps extends Omit<Props, 'icon'> {
    /**
     * We use the react component FortAwesome provides to render icons.
     * we will pass down all props to the component via {...rest} to expose it's api
     * https://github.com/FortAwesome/react-fontawesome/blob/master/README.md
     */

    /**
     * The ID of the icon to render.
     */
    readonly icon?: string;

    /**
     * The (accessibility) label for this icon
     */
    readonly label?: string;

    /**
     * Controls the padding around the icon in a standardized way.
     */
    readonly padded?: IconPadding;

    /**
     * An optional `className` to attach to the wrapper.
     */
    readonly className?: string;

    /**
     *  Adjust the color of the icon
     */
    readonly color?: IconColor;

    /**
     *  An optional css theme to be injected.
     */
    readonly theme?: IconTheme;
}

type DefaultProps = PickDefaultProps<IconProps, 'color' | 'padded'>;

export const defaultProps: DefaultProps = {
    color: 'default',
    padded: 'none'
};

class Icon extends PureComponent<IconProps> {
    public static readonly defaultProps = defaultProps;

    public render(): JSX.Element | null {
        const {padded, theme, label, icon, className, color, ...rest} = this.props;
        const iconClassName = icon;
        const classNames = mergeClassNames(
            theme!.icon,
            iconClassName,
            className,
            {
                [theme!['icon--paddedLeft']]: padded === 'left',
                [theme!['icon--paddedRight']]: padded === 'right',
                [theme!['icon--color-warn']]: color === 'warn',
                [theme!['icon--color-error']]: color === 'error',
                [theme!['icon--color-primaryBlue']]: color === 'primaryBlue',
            }
        );

        return <FontAwesomeIcon icon={icon ? this.getIconProp(icon) as any : 'question'} aria-label={label} className={classNames} {...rest} />;
    }

    private readonly getIconProp = (icon: string): IconProp => {
        const mappedIcon = mapper(icon);
        const iconArray = mappedIcon.split(' ');
        if (iconArray.length > 1) {
            const prefix = iconArray[0];
            const processedIcon = iconArray[1].startsWith('fa-') ? iconArray[1].substr(3) : iconArray[1];
            return [prefix as IconPrefix, processedIcon as IconName];
        } else {
            const prefix: IconPrefix = 'fas';
            return [prefix, mappedIcon as IconName];
        }
    }
}

export default Icon;
