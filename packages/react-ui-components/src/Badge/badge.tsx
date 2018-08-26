import React from 'react';
import mergeClassNames from 'classnames';

export interface BadgeProps {
        /**
         * An optional `className` to attach to the wrapper.
         */
        className: string | null | undefined;

        /**
         * Badge's label.
         */
        label: string;

        /**
         * An optional css theme to be injected.
         */
        theme?: {
            badge: string
        };
}

const Badge: React.SFC<BadgeProps> = ({
    className,
    label,
    theme,
    ...rest
}) => {
    const classNames = mergeClassNames({
        [theme && theme.badge || '']: true,
        [className || '']: className && className.length
    });

    return (
        <div {...rest} className={classNames}>
            {label}
        </div>
    );
};

export default Badge;
