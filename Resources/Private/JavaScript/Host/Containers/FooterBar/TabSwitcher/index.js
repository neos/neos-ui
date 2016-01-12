import React, {Component, PropTypes} from 'react';
import Immutable from 'immutable';
import mergeClassNames from 'classnames';
import {Bar} from 'Host/Components/';
import {backend} from 'Host/Service/';
import style from './style.css';

export default class TabSwitcher extends Component {
    static propTypes = {
        tabs: PropTypes.instanceOf(Immutable.Map),
        active: PropTypes.instanceOf(Immutable.Map),
        onSwitchTab: PropTypes.func
    }

    render() {
        const {active} = this.props;

        // Using Maps as children is not yet fully supported in react 0.14.1.
        const tabs = this.props.tabs.toArray();

        return (
            <Bar position="bottom" onDrop={e => this.onDrop(e)}>
                <div className={style.tabSwitcher}>
                    {tabs.map((tab, index) => tab.get('id') === active.get('id') ? this.renderActiveTab(tab, index) : this.renderTab(tab, index))}
                </div>
            </Bar>
        );
    }

    renderTab(tab, id) {
        return (
            <div key={id} className={style.tabSwitcher__item} onClick={() => this.onClick(tab)}>
                {tab.get('title')}
            </div>
        );
    }

    renderActiveTab(tab, id) {
        const classNames = mergeClassNames({
            [style.tabSwitcher__item]: true,
            [style['tabSwitcher__item--active']]: true
        });

        return (
            <div key={id} className={classNames}>
                {tab.get('title')}
            </div>
        );
    }

    onClick(tab) {
        const {onSwitchTab} = this.props;

        onSwitchTab(tab);
    }

    onDrop(e) {
        const {tabManager} = backend;

        tabManager.createTab(e.dataTransfer.getData('href'));
    }
}
