import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {I18n, Icon, DropDown} from 'Host/Components/';
import style from './style.css';

import {immutableOperations} from 'Shared/Utilities/';

const {$get} = immutableOperations;

@connect(state => ({
    userName: $get(state, 'user.name.fullName')
}))
export default class UserDropDown extends Component {
    static propTypes = {
        userName: PropTypes.string.isRequired
    };

    render() {
        const dropDownClassNames = {
            wrapper: style.dropDown,
            btn: style.dropDown__btn,
            contents: style.dropDown__contents
        };

        return (
            <div className={style.wrapper}>
                <DropDown label={this.props.userName} iconBefore="user" classNames={dropDownClassNames}>
                    <li className={style.dropDown__item}>
                        <form title="Logout" action="/neos/logout" method="post">
                            <button type="submit" name="" value="logout">
                                <Icon icon="power-off" className={style.dropDown__item__icon} />
                                <I18n fallback="Logout" />
                            </button>
                        </form>
                      </li>
                      <li className={style.dropDown__item}>
                          <a title="User Settings" href="/neos/user/usersettings">
                              <Icon icon="wrench" className={style.dropDown__item__icon} />
                              <I18n fallback="User Settings" />
                          </a>
                      </li>
                </DropDown>
            </div>
        );
    }
}
