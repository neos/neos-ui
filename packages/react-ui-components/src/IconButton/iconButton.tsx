import {IconName} from '@fortawesome/fontawesome-svg-core';
import mergeClassNames from 'classnames';
import React, {PureComponent} from 'react';
import {ButtonHoverStyle, ButtonSize, ButtonStyle, IButtonProps} from '../Button/button';

interface IconButtonTheme {
    readonly 'iconButton': string;
    readonly [key: string]: string;
}

interface IIconButtonProps {
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

    // TODO: This feels strange. Can we define the interface of those injected Components somewhere else?
    // also those interfaces should be exposed (export interface ...)
    /**
     * Static component dependencies which are injected from the outside (index.js)
     */
    readonly IconComponent: React.ComponentClass<{readonly icon: string}>;
    readonly ButtonComponent: React.ComponentClass<IButtonProps>;

    /**
     * Optional disabled flag
     */
    readonly disabled?: boolean;

    readonly style: ButtonStyle;

    readonly hoverStyle: ButtonHoverStyle;
}

class IconButton extends PureComponent<IIconButtonProps> {
    public static readonly defaultProps: Partial<IIconButtonProps> = {
        hoverStyle: 'brand',
        size: 'regular',
        style: 'transparent',
    };

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
