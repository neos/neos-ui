import React, {PureComponent} from 'react';

interface IPanelTheme {
    readonly 'panel': string;
}

interface IPanelProps {
    /**
     * The title to be rendered within the navigation item of this Panel.
     */
    readonly title: string;

    /**
     * An optional icon identifier which will be rendered within the navigation item of this Panel.
     */
    readonly icon?: string;

    /**
     * The children to render within the div node.
     */
    readonly children: any;

    /**
     * An optional css theme to be injected.
     */
    readonly theme?: IPanelTheme;
}

class Panel extends PureComponent<IPanelProps> {
    public static readonly displayName = 'Panel';

    public render(): JSX.Element {
        const {theme, children} = this.props;
        return (
            <div className={theme!.panel}>{children}</div>
        );
    }
}

export default Panel;
