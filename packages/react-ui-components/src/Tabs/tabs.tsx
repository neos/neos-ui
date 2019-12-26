import React, {PureComponent} from 'react';
import mergeClassNames from 'classnames';

import {PickDefaultProps} from '../../types';
import Panel from './panel.index';
import Icon from '../Icon';

export interface TabsProps {
    /**
     * The id of the active tab, defaults to an empty string.
     */
    readonly activeTab?: string | number;

    /**
     * An optional className to render on the wrapping div.
     */
    readonly className?: string;

    /**
     * The children panels to render.
     */
    readonly children: ReadonlyArray<React.ReactElement<any>>;

    /**
     * A css theme to be injected.
     */
    readonly theme: TabsTheme;
}

interface TabsTheme extends TabMenuItemTheme {
    readonly 'tabs': string;
    readonly 'tabs__content': string;
    readonly 'tabs__panel': string;
    readonly 'tabNavigation': string;
}

export const tabsDefaultProps: PickDefaultProps<TabsProps, 'activeTab'> = {
    activeTab: 0,
};

interface TabsState {
    readonly activeTab: string | number;
}

export default class Tabs extends PureComponent<TabsProps> {
    public static Panel = Panel;
    public state: TabsState = {
        activeTab: 0,
    };

    public static defaultProps = tabsDefaultProps;

    public UNSAFE_componentWillReceiveProps(newProps: TabsProps): void {
        const newactiveTab = newProps.activeTab;
        const {activeTab} = this.state;

        if (newactiveTab && newactiveTab !== activeTab) {
            this.setState({
                activeTab: newactiveTab
            });
        }
    }

    public getActiveTab(): string | number {
        // If activeTab is out of bounds, choose the first tab
        const {activeTab} = this.state;
        if (isNaN(activeTab as number)) {
            const activeTabs = this.props.children.filter(panel => panel.props.id === activeTab);
            return activeTabs.length === 0 ? (this.props.children[0].props.id || 0) : activeTab;
        } else if (activeTab < React.Children.count(this.props.children)) {
            return activeTab;
        }
        return 0;
    }

    public renderMenuItems(): JSX.Element {
        const {
            theme,
            children
        } = this.props;
        const activeTab = this.getActiveTab();

        const menuItems = children.map((panel, index) => (
            <TabMenuItem
                key={index}
                index={index}
                id={panel.props.id || index}
                // tslint:disable-next-line:jsx-no-string-ref
                ref={`tab-${index}`}
                onClick={this.handleTabNavItemClick}
                isActive={activeTab === (isNaN(activeTab as number) ? panel.props.id : index)}
                theme={theme}
                title={panel.props.title}
                icon={panel.props.icon}
                tooltip={panel.props.tooltip}
            />
        ));

        return (
            <ul className={theme.tabNavigation}>
                {menuItems}
            </ul>
        );
    }

    public handleTabNavItemClick = (id: string | number) => {
        this.setState({activeTab: id});
    }

    public renderPanels(): JSX.Element {
        const {theme, children} = this.props;
        const activeTab = this.getActiveTab();

        return (
            <div className={theme.tabs__content}>
                {children.map((panel, index) => {
                    const isActive = activeTab === (isNaN(activeTab as number) ? panel.props.id : index);
                    const style = {
                        display: isActive ? 'block' : 'none'
                    };

                    return (
                        <div
                            className={theme.tabs__panel}
                            key={index}
                            style={style}
                            role="tabpanel"
                            aria-hidden={isActive ? 'false' : 'true'}
                        >
                            {isActive && panel}
                        </div>
                    );
                })}
            </div>
        );
    }

    public render(): JSX.Element {
        const {theme, className} = this.props;
        const finalClassName = mergeClassNames(theme.tabs, className);

        return (
            <div className={finalClassName} role="tablist">
                {this.renderMenuItems()}
                {this.renderPanels()}
            </div>
        );
    }
}

export interface TabMenuItemProps {
    /**
     * The index
     */
    index: number;

    /**
     * The identifier which will be handed over to the onClick handler.
     */
    id: string | number;

    /**
     * The title to render for the given Panel.
     */
    title?: string;

    /**
     * The click handler which will be called with the passed index as it's only argument.
     */
    onClick: (id: string | number) => void;

    /**
     * A boolean which controls if the rendered anchor is displayed as active or not.
     */
    isActive?: boolean;

    /**
     * An optional icon identifier, if one is passed, an Icon will be rendered besides the title.
     */
    icon?: string;

    /**
     * An optional tooltip for the given Panel.
     */
    tooltip?: string;

    theme?: TabMenuItemTheme;
}

interface TabMenuItemTheme {
    readonly 'tabNavigation__item': string;
    readonly 'tabNavigation__item--isActive': string;
    readonly 'tabNavigation__itemBtn': string;
    readonly 'tabNavigation__itemBtnIcon': string;
    readonly 'tabNavigation__itemBtnIcon--hasLabel': string;
}

export const tabMenuItemDefaultProps: PickDefaultProps<TabMenuItemProps, 'isActive'> = {
    isActive: false
};

// tslint:disable-next-line:max-classes-per-file
export class TabMenuItem extends PureComponent<TabMenuItemProps> {
    public static readonly defaultProps = tabMenuItemDefaultProps;

    public render(): JSX.Element {
        const {
            theme,
            isActive,
            index,
            icon,
            title,
            tooltip,
        } = this.props;
        const finalClassName = mergeClassNames(
            theme!.tabNavigation__item,
            {
                [theme!['tabNavigation__item--isActive']]: isActive,
            },
        );
        const finalIconClassName = mergeClassNames(
            theme!.tabNavigation__itemBtnIcon,
            {
                [theme!['tabNavigation__itemBtnIcon--hasLabel']]: title && title.length,
            },
        );

        return (
            <li className={finalClassName} role="presentation">
                <button
                    className={theme!.tabNavigation__itemBtn}
                    onClick={this.handleClick}
                    role="tab"
                    aria-selected={isActive ? 'true' : 'false'}
                    aria-controls={`section${index}`}
                    title={tooltip}
                >
                    {icon ? <Icon icon={icon} className={finalIconClassName}/> : null}
                    {title}
                </button>
            </li>
        );
    }

    private readonly handleClick = () => {
        this.props.onClick(this.props.id);
    }
}
