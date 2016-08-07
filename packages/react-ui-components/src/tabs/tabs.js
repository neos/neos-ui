import React, {Component, PropTypes} from 'react';
import omit from 'lodash.omit';
import mergeClassNames from 'classnames';

export default class Tabs extends Component {
    static propTypes = {
        // The INT for the active tab, the count starts at 0.
        activeTab: PropTypes.number,

        className: PropTypes.string,
        children: PropTypes.any.isRequired,
        theme: PropTypes.shape({// eslint-disable-line quote-props
            'tabs': PropTypes.string,
            'tabs__content': PropTypes.string,
            'tabNavigation': PropTypes.string,
            'tabNavigation__item': PropTypes.string,
            'tabNavigation__item--isActive': PropTypes.string,
            'tabNavigation__itemBtn': PropTypes.string
        }).isRequired,

        //
        // Static component dependencies which are injected from the outside (index.js)
        //
        IconComponent: PropTypes.any.isRequired
    };

    static defaultProps = {
        activeTab: 0
    };

    constructor(props) {
        super(props);

        this.handleTabNavItemClick = this.activateTabForIndex.bind(this);
        this.state = {activeTab: props.activeTab};
    }

    componentWillReceiveProps(newProps) {
        const newActiveTab = newProps.activeTab;
        const {activeTab} = this.state;

        if (newActiveTab && newActiveTab !== activeTab) {
            this.setState({
                activeTab: newActiveTab
            });
        }
    }

    render() {
        const {theme, className} = this.props;
        const finalClassName = mergeClassNames(theme.tabs, className);

        return (
            <div className={finalClassName} role="tablist">
                {this.renderMenuItems()}
                {this.renderPanels()}
            </div>
        );
    }

    renderMenuItems() {
        const {
            IconComponent,
            theme,
            children
        } = this.props;
        const {activeTab} = this.state;

        const menuItems = React.Children.map(children, (panel, index) => (
            <TabMenuItem
                key={index}
                index={index}
                ref={`tab-${index}`}
                onClick={this.handleTabNavItemClick}
                isActive={activeTab === index}
                IconComponent={IconComponent}
                theme={theme}
                title={panel.props.title}
                icon={panel.props.icon}
                />
        ));

        return (
            <ul className={theme.tabNavigation}>
                {menuItems}
            </ul>
        );
    }

    activateTabForIndex(index) {
        this.setState({activeTab: index});
    }

    renderPanels() {
        const {theme, children} = this.props;

        return (
            <div ref="tab-panel" className={theme.tabs__content}>
                {React.Children.map(children, (panel, index) => {
                    const isActive = this.state.activeTab === index;
                    const style = {
                        display: isActive ? 'block' : 'none'
                    };

                    return (
                        <div
                            key={index}
                            style={style}
                            role="tabpanel"
                            aria-hidden={isActive ? 'false' : 'true'}
                            >
                            {panel}
                        </div>
                    );
                })}
            </div>
        );
    }
}

export class TabMenuItem extends Component {
    static propTypes = {
        index: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        onClick: PropTypes.func.isRequired,
        children: PropTypes.any.isRequired,
        isActive: PropTypes.bool,
        icon: PropTypes.string,

        theme: PropTypes.shape({// eslint-disable-line quote-props
            'tabNavigation__item': PropTypes.string,
            'tabNavigation__item--isActive': PropTypes.string,
            'tabNavigation__itemBtn': PropTypes.string
        }).isRequired,

        //
        // Static component dependencies which are injected from the outside.
        //
        IconComponent: PropTypes.any.isRequired
    };

    static defaultProps = {
        isActive: false
    };

    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    render() {
        const {
            theme,
            isActive,
            index,
            IconComponent,
            icon,
            title,
            ...restProps
        } = this.props;
        const rest = omit(restProps, ['onClick']);
        const finalClassName = mergeClassNames({
            [theme.tabNavigation__item]: true,
            [theme['tabNavigation__item--isActive']]: isActive
        });

        return (
            <li className={finalClassName} role="presentation" {...rest}>
                <button
                    className={theme.tabNavigation__itemBtn}
                    onClick={this.handleClick}
                    role="tab"
                    aria-selected={isActive ? 'true' : 'false'}
                    aria-controls={`section${index}`}
                    >
                    {icon ? <IconComponent icon={icon} /> : null}
                    {title}
                </button>
            </li>
        );
    }

    handleClick() {
        this.props.onClick(this.props.index);
    }
}
