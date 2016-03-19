import React, {Component, PropTypes} from 'react';
import {executeCallback} from 'Shared/Utilities/index';
import Icon from 'Components/Icon/index';
import mergeClassNames from 'classnames';
import style from './style.css';

export default class Tabs extends Component {
    static propTypes = {
        // The INT for the active tab, the count starts at 0.
        activeTab: PropTypes.number,

        className: PropTypes.string,
        children: PropTypes.node.isRequired
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
        const className = mergeClassNames(style.tabs, this.props.className);

        return (
            <div className={className} role="tablist">
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
                const isActive = this.state.activeTab === index;
                const classes = mergeClassNames({
                    [style.tabNavigation__item]: true,
                    [style['tabNavigation__item--isActive']]: isActive
                });
                const onClick = e => executeCallback({e, cb: () => this.activateTabForIndex(index)});

                return (
                    <li ref={ref} key={index} className={classes} role="presentation">
                        <button
                            className={style.tabNavigation__itemBtn}
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
            <ul className={style.tabNavigation}>
                {menuItems}
            </ul>
        );
    }

    activateTabForIndex(index) {
        this.setState({activeTab: index});
    }

    renderPanels() {
        const {children} = this.props;

        return (
            <div ref="tab-panel">
                {children.map((panel, index) => {
                    const isActive = this.state.activeTab === index;
                    const style = {
                        display: isActive ? 'block' : 'none'
                    };
                    const panelProps = {};

                    if (!isActive) {
                        panelProps['aria-hidden'] = 'true';
                    }

                    return (
                        <div key={index} style={style} role="tabpanel" {...panelProps}>
                            {panel}
                        </div>
                    );
                })}
            </div>
        );
    }
}
