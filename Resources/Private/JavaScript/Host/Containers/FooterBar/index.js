import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Immutable from 'immutable';
import {actions} from 'Host/Redux/';
import {Bar} from 'Host/Components/';
import TabSwitcher from './TabSwitcher/';
import mergeClassNames from 'classnames';
import style from './style.css';
import {immutableOperations} from 'Shared/Utilities/';

const {$get} = immutableOperations;

@connect(state => ({
    tabs: $get(state, 'ui.tabs'),
    isHidden: $get(state, 'ui.fullScreen.isFullScreen')
}), {
    switchTo: actions.UI.Tabs.switchTo
})
export default class FooterBar extends Component {
    static propTypes = {
        tabs: PropTypes.instanceOf(Immutable.Map),
        isHidden: PropTypes.bool.isRequired,
        switchTo: PropTypes.func.isRequired
    };

    render() {
        const {tabs, isHidden} = this.props;
        const classNames = mergeClassNames({
            [style.footerBar]: true,
            [style['footerBar--isHidden']]: isHidden
        });
        return (
            <Bar className={classNames} position="bottom">
                <TabSwitcher tabs={tabs.get('byId')} active={tabs.get('active')} onSwitchTab={tab => this.props.switchTo(tab.get('id'))} />
            </Bar>
        );
    }
}
