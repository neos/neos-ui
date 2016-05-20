import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {$transform, $get} from 'plow-js';

import {I18n, Icon, DropDown} from 'Components/index';

import style from './style.css';

@connect($transform({
    userName: $get('user.name.fullName')
}))
export default class UserDropDown extends Component {
    static propTypes = {
        userName: PropTypes.string.isRequired
    };

    render() {
        return (
            <div className={style.wrapper}>
                <DropDown className={style.dropDown}>
                    <DropDown.Header className={style.dropDown__btn} id="neos__primaryToolbar__userDropDown__btn">
                        <Icon className={style.dropDown__btnIcon} icon="user" />
                        {this.props.userName}
                    </DropDown.Header>
                    <DropDown.Contents className={style.dropDown__contents} id="neos__primaryToolbar__userDropDown__contents">
                        <li className={style.dropDown__item}>
                            <form title="Logout" action="/neos/logout" method="post">
                                <button type="submit" name="" value="logout" id="neos__primaryToolbar__userDropDown__logoutButton">
                                    <Icon icon="power-off" className={style.dropDown__itemIcon} />
                                    <I18n fallback="Logout" />
                                </button>
                            </form>
                          </li>
                          <li className={style.dropDown__item}>
                              <a title="User Settings" href="/neos/user/usersettings" id="neos__primaryToolbar__userDropDown__userSettings">
                                  <Icon icon="wrench" className={style.dropDown__item__icon} />
                                  <I18n fallback="User Settings" />
                              </a>
                          </li>
                    </DropDown.Contents>
                </DropDown>
            </div>
        );
    }
}
