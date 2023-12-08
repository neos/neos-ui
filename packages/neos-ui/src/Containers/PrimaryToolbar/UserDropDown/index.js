import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {neos} from '@neos-project/neos-ui-decorators';
import Icon from '@neos-project/react-ui-components/src/Icon/';
import DropDown from '@neos-project/react-ui-components/src/DropDown/';
import RestoreButtonItem from './RestoreButtonItem';

import I18n from '@neos-project/neos-ui-i18n';

import style from './style.module.css';
@connect(state => ({
    userName: state?.user?.name?.fullName,
    impersonateStatus: state?.user?.impersonate?.status
}))
@neos()
export default class UserDropDown extends PureComponent {
    static propTypes = {
        userName: PropTypes.string.isRequired,
        impersonateStatus: PropTypes.bool.isRequired
    };

    render() {
        const logoutUri = this.props.neos?.routes?.core?.logout;
        const userSettingsUri = this.props.neos?.routes?.core?.modules?.userSettings;
        const {csrfToken} = document.getElementById('appContainer').dataset;
        return (
            <div className={style.wrapper}>
                <DropDown className={style.dropDown}>
                    <DropDown.Header className={style.dropDown__btn}>
                        <Icon className={style.dropDown__btnIcon} icon="user"/>
                        <span className={style.dropDown__userName}>{this.props.userName}</span>
                    </DropDown.Header>
                    <DropDown.Contents className={style.dropDown__contents}>
                        <li className={style.dropDown__item}>
                            <form title="Logout" action={logoutUri} method="post" role="presentation">
                                <input type="hidden" name="__csrfToken" value={csrfToken}/>
                                <button onClick={e => e.stopPropagation()} type="submit" name="" value="logout">
                                    <Icon icon="sign-out-alt" aria-hidden="true" className={style.dropDown__itemIcon}/>
                                    <I18n id="logout" sourceName="Main" packageKey="Neos.Neos" fallback="Logout"/>
                                </button>
                            </form>
                        </li>
                        <li className={style.dropDown__item}>
                            <a title="User Settings" href={userSettingsUri}>
                                <Icon icon="wrench" aria-hidden="true" className={style.dropDown__itemIcon}/>
                                <I18n id="userSettings.label" sourceName="Modules" packageKey="Neos.Neos" fallback="User Settings"/>
                            </a>
                        </li>
                        {this.props.impersonateStatus === true ? (
                            <RestoreButtonItem />
                        ) : null}
                    </DropDown.Contents>
                </DropDown>
            </div>
        );
    }
}
