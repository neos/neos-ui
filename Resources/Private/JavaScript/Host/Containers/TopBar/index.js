import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Bar, I18n, Button} from '../../Components/';
import UserDropDown from './UserDropDown/';
import PublishDropDown from './PublishDropDown/';
import style from './style.css';

@connect()
export default class TopBar extends Component {
    render() {
        return (
            <Bar position="top" className={style.topBar}>
              <Button className={style.topBar__btn} style="clean" hoverStyle="clean" onClick={this.onMenuToggle.bind(this)}>
                <div className={style.topBar__menuIcon}></div>
              </Button>
              <Button className={style.topBar__btn} style="clean" hoverStyle="clean" onClick={this.onLeftSidebarToggle.bind(this)}>
                  <I18n target="Navigate" />
              </Button>
              <Button className={style.topBar__btn} style="clean" hoverStyle="clean" onClick={this.onEditModeToggle.bind(this)}>
                  <I18n target="Edit / Preview" />
              </Button>

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
