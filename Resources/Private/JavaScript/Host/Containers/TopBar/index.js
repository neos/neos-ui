import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {Bar} from 'Host/Components/';
import UserDropDown from './UserDropDown/';
import PublishDropDown from './PublishDropDown/';
import MenuToggler from './MenuToggler/';
import LeftSideBarToggler from './LeftSideBarToggler/';
import EditModePanelToggler from './EditModePanelToggler/';
import style from './style.css';
import mergeClassNames from 'classnames';
import {immutableOperations} from 'Shared/Utilities/';

const {$get} = immutableOperations;

@connect(state => ({
    isFullScreen: $get(state, 'ui.fullScreen.isFullScreen')
}))
export default class TopBar extends Component {
    static propTypes = {
        isFullScreen: PropTypes.bool.isRequired
    };
    render() {
        const classNames = mergeClassNames({
            [style.topBar]: true,
            [style['topBar--isHidden']]: this.props.isFullScreen
        });
        return (
            <Bar position="top" className={classNames}>
                <MenuToggler className={style.topBar__btn} />
                <LeftSideBarToggler className={style.topBar__btn} />
                <EditModePanelToggler className={style.topBar__btn} />

                <div className={style.topBar__rightSidedActions}>
                      <UserDropDown />
                      <PublishDropDown />
                </div>
            </Bar>
        );
    }
}
