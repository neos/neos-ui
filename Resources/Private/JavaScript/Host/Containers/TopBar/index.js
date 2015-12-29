import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Bar, MenuToggler} from '../../Components/';
import TopBarToggler from './TopBarToggler/';
import UserDropDown from './UserDropDown/';
import PublishDropDown from './PublishDropDown/';
import style from './style.css';

@connect()
export default class TopBar extends Component {
    render() {
        return (
            <Bar position="top" className={style.topBar}>
              <MenuToggler onClick={() => this.onMenuToggle()} />
              <TopBarToggler label="Navigate" onClick={() => this.onLeftSidebarToggle()} />
              <TopBarToggler label="Edit / Preview" onClick={() => this.onEditModeToggle()} />

              <div className={style.topBar__rightSidedActions}>
                  <UserDropDown currentUserName="John Doe" />
                  <PublishDropDown />
              </div>
            </Bar>
        );
    }

    onMenuToggle() {
        console.log('toggle menu...');
    }

    onLeftSidebarToggle() {
        console.log('toggle left sidebar...');
    }
    onEditModeToggle() {
        console.log('toggle edit mode container...');
    }
}
