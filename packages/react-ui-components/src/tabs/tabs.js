import React, {Component, PropTypes} from 'react';
import executeCallback from './../_lib/executeCallback.js';
import Icon from './../icon/index';
import mergeClassNames from 'classnames';

export default class Tabs extends Component {
    static propTypes = {
        // The INT for the active tab, the count starts at 0.
        activeTab: PropTypes.number,

        className: PropTypes.string,
        children: PropTypes.node.isRequired,
        theme: PropTypes.shape({// eslint-disable-line quote-props
            'tabs': PropTypes.string,
            'tabs__content': PropTypes.string,
            'tabNavigation': PropTypes.string,
            'tabNavigation__item': PropTypes.string,
            'tabNavigation__item--isActive': PropTypes.string,
            'tabNavigation__itemBtn': PropTypes.string
        }).isRequired
    };

    static defaultProps = {
        activeTab: 0
    };

    constructor(props) {
        super(props);

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
        const {theme, children} = this.props;

        const menuItems = children
            .map(panel => typeof panel === 'function' ? panel() : panel)
            .filter(panel => panel)
            .map((panel, index) => {
                const ref = `tab-${index}`;
                const {title, icon} = panel.props;
                const isActive = this.state.activeTab === index;
                const classes = mergeClassNames({
                    [theme.tabNavigation__item]: true,
                    [theme['tabNavigation__item--isActive']]: isActive
                });
                const onClick = e => executeCallback({e, cb: () => this.activateTabForIndex(index)});

                return (
                    <li ref={ref} key={index} className={classes} role="presentation">
                        <button
                            className={theme.tabNavigation__itemBtn}
                            onClick={onClick}
                            role="tab"
                            aria-selected={isActive ? 'true' : 'false'}
                            aria-controls={`section${index}`}
                            >
                            {icon ? <Icon icon={icon} /> : null}
                            {title}
                        </button>
                    </li>
                );
            });

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
                {children.map((panel, index) => {
                    const isActive = this.state.activeTab === index;
                    const theme = {
                        display: isActive ? 'block' : 'none'
                    };
                    const panelProps = {};

                    if (!isActive) {
                        panelProps['aria-hidden'] = 'true';
                    }

                    return (
                        <div {...panelProps} key={index} theme={theme} role="tabpanel">
                            {panel}
                        </div>
                    );
                })}
            </div>
        );
    }
}
