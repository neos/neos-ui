import React, {Component, PropTypes} from 'react';
import {executeCallback} from '../../../Abstracts/';
import Icon from '../../Icon/';
import mergeClassNames from 'classnames';
import style from './style.css';

export default class Tabs extends Component {
    static propTypes = {
        className: PropTypes.string,
        activeTab: PropTypes.number,
        onAfterChange: PropTypes.func,
        children: PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.element
        ]).isRequired
    }

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
                {this.renderActivePanel()}
            </div>
        );
    }

    renderMenuItems() {
        const menuItems = this.props.children
            .map(panel => typeof panel === 'function' ? panel() : panel)
            .filter(panel => panel)
            .map((panel, index) => {
                const ref = `tab-${index + 1}`;
                const {title, icon} = panel.props;
                const classes = mergeClassNames({
                    [style.tabs__navigation__item]: true,
                    [style['tabs__navigation__item--isActive']]: this.state.activeTab === (index + 1)
                });

                return (
                    <li ref={ref} key={index} className={classes}>
                        <a onClick={e => executeCallback(e, () => this.activateTabForIndex(index + 1))}>
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
        const onAfterChange = this.props.onAfterChange;
        const selectedPanel = this.refs['tab-panel'];
        const selectedTabMenu = this.refs[`tab-${index}`];

        this.setState({activeTab: index}, () => {
            if (onAfterChange) {
                onAfterChange(index, selectedPanel, selectedTabMenu);
            }
        });
    }

    renderActivePanel() {
        const index = this.state.activeTab - 1;
        const panel = this.props.children[index];

        return (
            <div ref="tab-panel">
                {panel}
            </div>
        );
    }
}
Tabs.defaultProps = {
    activeTab: 1
};
