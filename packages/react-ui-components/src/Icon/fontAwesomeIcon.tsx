import {IconName, IconPrefix} from '@fortawesome/fontawesome-svg-core';
import {FontAwesomeIcon as FontAwesomeIconOriginComponent} from '@fortawesome/react-fontawesome';
import mergeClassNames from 'classnames';
import React, {PureComponent} from 'react';

import {defaultProps} from './iconDefaultProps';
import {IconProps} from './icon';
import mapper from './mapper';

class FontAwesomeIcon extends PureComponent<IconProps> {
    public static readonly defaultProps = defaultProps;

    public render(): JSX.Element | null {
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
                [theme!['icon--color-primaryBlue']]: color === 'primaryBlue'
            }
        );

        return <FontAwesomeIconOriginComponent icon={icon ? this.getIconProp(icon) as any : 'question'} aria-label={label} className={classNames} {...rest} />;
    }

    private readonly getIconProp = (icon: string): any => {
        const mappedIcon = mapper(icon);
        const iconArray = mappedIcon.split(' ');
        if (iconArray.length > 1) {
            const prefix = iconArray[0];
            const processedIcon = iconArray[1].startsWith('fa-') ? iconArray[1].substr(3) : iconArray[1];
            return [prefix as IconPrefix, processedIcon as IconName];
        }
        const prefix: IconPrefix = 'fas';
        return [prefix, mappedIcon as IconName];
    }
}

export default FontAwesomeIcon;
