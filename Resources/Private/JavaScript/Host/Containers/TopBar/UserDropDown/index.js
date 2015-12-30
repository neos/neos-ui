import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import mergeClassNames from 'classnames';
import {I18n, Icon, DropDown} from '../../../Components/';
import style from './style.css';

@connect()
export default class UserDropDown extends Component {
    static propTypes = {
        currentUserName: PropTypes.string.isRequired
    }

    render() {
        const {currentUserName} = this.props;
        const dropDownClassNames = {
            wrapper: style.dropDown,
            btn: style.dropDown__btn,
            contents: style.dropDown__contents
        };
        const logoutItemClassName = mergeClassNames({
            [style['dropDown__item--topDark']]: true,
            [style.dropDown__item]: true
        });

        return (
            <div className={style.wrapper}>
                <DropDown label={currentUserName} iconBefore="user" classNames={dropDownClassNames}>
                    <li className={logoutItemClassName}>
                        <form title="Logout" action="/neos/logout" method="post">
                            <button type="submit" name="" value="logout">
                                <Icon icon="power-off" className={style.dropDown__item__icon} />
                                <I18n target="Logout" />
                            </button>
                        </form>
                      </li>
                      <li className={`${style.dropDown__item}`}>
                          <a title="User Settings" href="/neos/user/usersettings">
                              <Icon icon="wrench" className={style.dropDown__item__icon} />
                              <I18n target="User Settings" />
                          </a>
                      </li>
                </DropDown>
            </div>
        );
    }
}
