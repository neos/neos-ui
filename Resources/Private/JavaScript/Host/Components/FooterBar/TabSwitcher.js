import React, {Component, PropTypes} from 'react';
import Immutable from 'immutable';

export default class TopBar extends Component {
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
            <div className="bar bar--bottom">
                <div className="tabSwitcher">
                    {tabs.map((tab, index) => tab.get('id') === active ? this.renderActiveTab(tab, index) : this.renderTab(tab, index))}
                </div>
            </div>
        );
    }

    renderTab(tab, id) {
        return (
            <div key={id} className="tabSwitcher__tab" onClick={() => this.onClick(tab)}>
                <span className="tabSwitcher__tab__label">{tab.get('title')}</span>
            </div>
        );
    }

    renderActiveTab(tab, id) {
        return (
            <div key={id} className="tabSwitcher__tab tabSwitcher__tab--active">
                <span className="tabSwitcher__tab__label">{tab.get('title')}</span>
            </div>
        );
    }

    onClick(tab) {
        const {onSwitchTab} = this.props;

        onSwitchTab(tab);
    }
}
