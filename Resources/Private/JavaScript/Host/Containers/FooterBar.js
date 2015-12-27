import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import classNames from 'classnames';

import actions from '../Actions';

import TabSwitcher from '../Components/FooterBar/TabSwitcher.js';

@connect(state => {
    return {
        tabs: state.get('tabs')
    };
})
export default class TopBar extends Component {

    static propTypes = {
        tabs: PropTypes.instanceOf(Immutable.Map)
    };

    render() {
        const { tabs } = this.props;

        return <div className="bar bar--bottom">
            <TabSwitcher tabs={tabs.get('byId')} active={tabs.get('active')} onSwitchTab={tab => this.onSwitchTab(tab)} />
        </div>;
    }

    onSwitchTab(tab) {
        const { dispatch } = this.props;

        dispatch(actions.UI.Tabs.switchToTab(tab.get('id')));
    }

}
