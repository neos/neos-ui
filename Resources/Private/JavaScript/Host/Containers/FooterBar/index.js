import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import Immutable from 'immutable';
import {actions} from 'Host/Redux/';
import {Bar} from 'Host/Components/';
import TabSwitcher from './TabSwitcher/';

@connect(state => ({
    tabs: state.get('ui').get('tabs')
}))
export default class FooterBar extends Component {
    static propTypes = {
        tabs: PropTypes.instanceOf(Immutable.Map),
        dispatch: PropTypes.any.isRequired
    };

    render() {
        const {tabs} = this.props;

        return (
            <Bar position="bottom">
                <TabSwitcher tabs={tabs.get('byId')} active={tabs.get('active')} onSwitchTab={tab => this.onSwitchTab(tab)} />
            </Bar>
        );
    }

    onSwitchTab(tab) {
        const {dispatch} = this.props;

        dispatch(actions.UI.Tabs.switchTo(tab.get('id')));
    }
}
