import React, {PureComponent} from 'react';

import {FontAwesomeIconProps} from '@fortawesome/react-fontawesome';
import {PickDefaultProps, Omit} from '../../types';
import FontAwesomeIcon from './fontAwesomeIcon';
import ResourceIcon, {ResourceIconProps} from './resourceIcon';

type IconSize = 'xs' | 'sm' | 'lg';
type IconPadding = 'none' | 'left' | 'right';
type IconColor = 'default' | 'warn' | 'error' | 'primaryBlue';

export interface IconTheme {
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

export interface IconProps extends Omit<FontAwesomeIconProps, 'icon'> {
    /**
     * We use the react component FortAwesome provides to render icons.
     * we will pass down all props to the component via {...rest} to expose it's api
     * https://github.com/FortAwesome/react-fontawesome/blob/master/README.md
     */

    /**
     * The identifier of the icon to render.
     * Can be a font-awesome icon identifier or a asset resource.
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
     *  Adjust the size of the icon
     */
    readonly size?: IconSize;

    /**
     *  An optional css theme to be injected.
     */
    readonly theme?: IconTheme;
}

type DefaultProps = PickDefaultProps<IconProps, 'color' | 'padded' | 'size'>;

export const defaultProps: DefaultProps = {
    color: 'default',
    padded: 'none',
    size: 'sm'
};

class Icon extends PureComponent<IconProps> {
    public static readonly defaultProps = defaultProps;

    public render(): JSX.Element | null {
        const {icon} = this.props;

        if (icon && icon.substr(0, 11) === 'resource://') {
            return <ResourceIcon {...this.props as ResourceIconProps} />;
        } else {
            return <FontAwesomeIcon {...this.props} />;
        }
    }
}

export default Icon;
