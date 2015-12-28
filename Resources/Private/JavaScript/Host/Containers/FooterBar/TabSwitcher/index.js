import React, {Component, PropTypes} from 'react';
import Immutable from 'immutable';
import mergeClassNames from 'classnames';
import style from './style.css';
import {Bar} from '../../../Components/';

export default class TabSwitcher extends Component {
    static propTypes = {
        tabs: PropTypes.instanceOf(Immutable.Map),
        active: PropTypes.string,
        onSwitchTab: PropTypes.func
    }

    render() {
        const {active} = this.props;

        // Using Maps as children is not yet fully supported in react 0.14.1.
        const tabs = this.props.tabs.toArray();

        return (
            <Bar position="bottom">
                <div className={style.wrapper}>
                    {tabs.map((tab, index) => tab.get('id') === active ? this.renderActiveTab(tab, index) : this.renderTab(tab, index))}
                </div>
            </Bar>
        );
    }

    renderTab(tab, id) {
        return (
            <div key={id} className={style.item} onClick={() => this.onClick(tab)}>
                {tab.get('title')}
            </div>
        );
    }

    renderActiveTab(tab, id) {
        const classNames = mergeClassNames({
            [style.item]: true,
            [style.activeItem]: true
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
}
