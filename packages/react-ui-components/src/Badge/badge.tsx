import mergeClassNames from 'classnames';
import React, {PureComponent} from 'react';

interface BadgeTheme {
    readonly badge: string;
}

export interface BadgeProps {
    /**
     * An optional `className` to attach to the wrapper.
     */
    readonly className?: string;

    /**
     * Badge's label.
     */
    readonly label: string;

    /**
     * An optional css theme to be injected.
     */
    readonly theme?: BadgeTheme;
}

class Badge extends PureComponent<BadgeProps> {
    public render(): JSX.Element {
        const {
            className,
            theme,
            label,
            ...rest
        } = this.props;
        const finalClassName = mergeClassNames(theme!.badge, className);

        return (
            <div {...rest} className={finalClassName}>{label}</div>
        );
    }
}

export default Badge;
