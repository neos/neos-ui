import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Bar} from '../../Components/';
import UserDropDown from './UserDropDown/';
import PublishDropDown from './PublishDropDown/';
import MenuToggler from './MenuToggler/';
import LeftSideBarToggler from './LeftSideBarToggler/';
import EditModePanelToggler from './EditModePanelToggler/';
import style from './style.css';

@connect()
export default class TopBar extends Component {
    render() {
        return (
            <Bar position="top" className={style.topBar}>
                <MenuToggler className={style.topBar__btn} />
                <LeftSideBarToggler className={style.topBar__btn} />
                <EditModePanelToggler className={style.topBar__btn} />

                <div className={style.topBar__rightSidedActions}>
                      <UserDropDown currentUserName="John Doe" />
                      <PublishDropDown />
                </div>
            </Bar>
        );
    }
}
