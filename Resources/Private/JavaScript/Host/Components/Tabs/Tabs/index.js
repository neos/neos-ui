import React, {Component, PropTypes} from 'react';
import {executeCallback} from 'Host/Abstracts/';
import Icon from 'Host/Components/Icon/';
import mergeClassNames from 'classnames';
import style from './style.css';

export default class Tabs extends Component {
    static propTypes = {
        // The INT for the active tab, the count starts at 0.
        activeTab: PropTypes.number,

        className: PropTypes.string,
        children: PropTypes.node.isRequired
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
        const className = mergeClassNames(style.tabs, this.props.className);

        return (
            <div className={className}>
                {this.renderMenuItems()}
                {this.renderPanels()}
            </div>
        );
    }

    renderMenuItems() {
        const menuItems = this.props.children
            .map(panel => typeof panel === 'function' ? panel() : panel)
            .filter(panel => panel)
            .map((panel, index) => {
                const ref = `tab-${index}`;
                const {title, icon} = panel.props;
                const classes = mergeClassNames({
                    [style.tabs__navigation__item]: true,
                    [style['tabs__navigation__item--isActive']]: this.state.activeTab === (index)
                });
                const onClick = e => executeCallback({e, cb: () => this.activateTabForIndex(index)});

                return (
                    <li ref={ref} key={index} className={classes}>
                        <a onClick={onClick}>
                            {icon ? <Icon icon={icon} /> : null}
                            {title}
                        </a>
                    </li>
                );
            });

        return (
            <ul className={style.tabs__navigation}>
                {menuItems}
            </ul>
        );
    }

    activateTabForIndex(index) {
        this.setState({activeTab: index});
    }

    renderPanels() {
        const {children} = this.props;
        const activeIndex = this.state.activeTab;

        return (
            <div ref="tab-panel">
                {children.map((panel, index) => {
                    const style = {
                        display: activeIndex === index ? 'block' : 'none'
                    };

                    return (
                        <div key={index} style={style}>
                            {panel}
                        </div>
                    );
                })}
            </div>
        );
    }
}
Tabs.defaultProps = {
    activeTab: 0
};
