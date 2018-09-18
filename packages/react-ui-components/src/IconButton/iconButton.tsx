import {IconName} from '@fortawesome/fontawesome-svg-core';
import mergeClassNames from 'classnames';
import React, {PureComponent} from 'react';

import {PickDefaultProps} from '../../types';
import {ButtonHoverStyle, ButtonProps, ButtonSize, ButtonStyle} from '../Button/button';
import {IconProps} from '../Icon/icon';

interface IconButtonTheme {
    readonly 'iconButton': string;
    readonly [key: string]: string;
}

interface IconButtonProps {
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

    // TODO: This feels strange. Can we use the actual class here?
    /**
     * Static component dependencies which are injected from the outside (index.js)
     */
    readonly IconComponent: React.ComponentClass<IconProps>;
    readonly ButtonComponent: React.ComponentClass<ButtonProps>;

    /**
     * Optional disabled flag
     */
    readonly disabled?: boolean;

    readonly style: ButtonStyle;

    readonly hoverStyle: ButtonHoverStyle;
}

type DefaultProps = PickDefaultProps<IconButtonProps, 'hoverStyle' | 'size' | 'style'>;

const defaultProps: DefaultProps = {
    hoverStyle: 'brand',
    size: 'regular',
    style: 'transparent',
};

class IconButton extends PureComponent<IconButtonProps> {
    public static readonly defaultProps = defaultProps;

    public render(): JSX.Element {
        const {
            IconComponent,
            ButtonComponent,
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
            theme![`size-${size}`],
            {
                [theme!['iconButton--disabled']]: disabled
            }
        );

        return (
            <ButtonComponent {...rest} size={size} className={finalClassName}>
                <IconComponent icon={icon}/>
            </ButtonComponent>
        );
    }
}

export default IconButton;
