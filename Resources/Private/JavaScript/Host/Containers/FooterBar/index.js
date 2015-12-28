import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import Immutable from 'immutable';
import actions from '../../Actions/';
import {Bar} from '../../Components/';
import TabSwitcher from './TabSwitcher/';

@connect(state => {
    return {
        tabs: state.get('tabs')
    };
})
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

        dispatch(actions.UI.Tabs.switchToTab(tab.get('id')));
    }
}
