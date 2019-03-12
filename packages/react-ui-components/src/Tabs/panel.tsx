import React, {PureComponent, ReactNode} from 'react';

export interface PanelTheme {
    readonly 'panel': string;
}

export interface PanelProps {
    /**
     * The title to be rendered within the navigation item of this Panel.
     */
    readonly title?: string;

    /**
     * An optional icon identifier which will be rendered within the navigation item of this Panel.
     */
    readonly icon?: string;

    /**
     * The children to render within the div node.
     */
    readonly children: ReactNode;

    /**
     * An optional css theme to be injected.
     */
    readonly theme?: PanelTheme;
}

export default class Panel extends PureComponent<PanelProps> {
    public static readonly displayName = 'Panel';

    public render(): JSX.Element {
        const {theme, children} = this.props;
        return (
            <div className={theme!.panel}>{children}</div>
        );
    }
}
