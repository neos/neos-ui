import mergeClassNames from 'classnames';
import React, {PureComponent} from 'react';

type SideBarPosition = 'left' | 'right';

interface SideBarTheme {
    readonly 'sideBar': string;
    readonly 'sideBar--left': string;
    readonly 'sideBar--right': string;
}

export interface SideBarProps {
    /**
     * This prop controls the absolute positioning of the SideBar.
     */
    readonly position: SideBarPosition;

    /**
     * An optional className to render on the div node.
     */
    readonly className?: string;

    /**
     * The children to render within the div node.
     */
    readonly children: React.ReactNode;

    /**
     * An optional css theme to be injected.
     */
    readonly theme?: SideBarTheme;
}

class SideBar extends PureComponent<SideBarProps> {
    public render(): JSX.Element {
        const {
            position,
            className,
            children,
            theme,
            ...rest
        } = this.props;
        const classNames = mergeClassNames(
            className,
            theme!.sideBar,
            {
                [theme!['sideBar--left']]: position === 'left',
                [theme!['sideBar--right']]: position === 'right'
            }
        );

        return (
            <div {...rest} className={classNames}>
                {children}
            </div>
        );
    }
}

export default SideBar;
