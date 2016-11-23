import React, {Component, PropTypes} from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import {connect} from 'react-redux';
import {$transform, $get} from 'plow-js';
import Icon from '@neos-project/react-ui-components/lib/Icon/';
import DropDown from '@neos-project/react-ui-components/lib/DropDown/';

import I18n from '@neos-project/neos-ui-i18n';

import style from './style.css';

@connect($transform({
    userName: $get('user.name.fullName')
}))
export default class UserDropDown extends Component {
    static propTypes = {
        userName: PropTypes.string.isRequired
    };

    shouldComponentUpdate(...args) {
        return shallowCompare(this, ...args);
    }

    render() {
        return (
            <div className={style.wrapper}>
                <DropDown className={style.dropDown}>
                    <DropDown.Header className={style.dropDown__btn}>
                        <Icon className={style.dropDown__btnIcon} icon="user"/>
                        {this.props.userName}
                    </DropDown.Header>
                    <DropDown.Contents className={style.dropDown__contents}>
                        <li className={style.dropDown__item}>
                            <form title="Logout" action="/neos/logout" method="post">
                                <button type="submit" name="" value="logout">
                                    <Icon icon="power-off" className={style.dropDown__itemIcon}/>
                                    <I18n id="logout" fallback="Logout"/>
                                </button>
                            </form>
                        </li>
                        <li className={style.dropDown__item}>
                            <a title="User Settings" href="/neos/user/usersettings">
                                <Icon icon="wrench" className={style.dropDown__item__icon}/>
                                <I18n id="userSettings_label" sourceName="Modules" fallback="User Settings"/>
                            </a>
                        </li>
                    </DropDown.Contents>
                </DropDown>
            </div>
        );
    }
}
