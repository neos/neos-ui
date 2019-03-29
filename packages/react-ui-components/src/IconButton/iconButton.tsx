import {IconName} from '@fortawesome/fontawesome-svg-core';
import mergeClassNames from 'classnames';
import React, {PureComponent} from 'react';

import {PickDefaultProps} from '../../types';
import Button from '../Button';
import {ButtonHoverStyle, ButtonSize, ButtonStyle, HTMLButtonElementAttributesExceptStyle} from '../Button/button';
import Icon from '../Icon';

interface IconButtonTheme {
    readonly 'iconButton': string;
    readonly 'iconButton--disabled': string;
}

export interface IconButtonProps extends HTMLButtonElementAttributesExceptStyle {
    /**
     * The icon key which gets passed to the Icon Component.
     */
    readonly icon: string | IconName;

    /**
     * An optional `className` to attach to the wrapper.
     */
    readonly className?: string;

    /**
     * Defines the size of the icon button.
     */
    readonly size: ButtonSize;

    /**
     * An optional css theme to be injected.
     */
    readonly theme?: IconButtonTheme;

    /**
     * Optional disabled flag
     */
    readonly disabled?: boolean;

    readonly style: ButtonStyle;

    readonly hoverStyle: ButtonHoverStyle;
}

type DefaultProps = PickDefaultProps<IconButtonProps, 'hoverStyle' | 'size' | 'style'>;

export const defaultProps: DefaultProps = {
    hoverStyle: 'brand',
    size: 'regular',
    style: 'transparent',
};

class IconButton extends PureComponent<IconButtonProps> {
    public static readonly defaultProps = defaultProps;

    public render(): JSX.Element {
        const {
            className,
            theme,
            icon,
            size,
            disabled,
            ...rest
        } = this.props;
        const finalClassName = mergeClassNames(
            className,
            theme!.iconButton,
            // @ts-ignore implizit any because IconButtonTheme has no index signature
            theme![`size-${size}`],
            {
                [theme!['iconButton--disabled']]: disabled
            }
        );

        return (
            <Button {...rest} size={size} className={finalClassName} disabled={disabled}>
                <Icon icon={icon}/>
            </Button>
        );
    }
}

export default IconButton;
