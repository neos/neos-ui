/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */
import React from 'react';
// @ts-ignore
import {connect} from 'react-redux';

import {neos} from '@neos-project/neos-ui-decorators';
import {Icon, DropDown} from '@neos-project/react-ui-components';
import {I18nRegistry} from '@neos-project/neos-ts-interfaces';
import {NeosContextInterface} from '@neos-project/neos-ui-decorators/src/neos';
import {showFlashMessage} from '@neos-project/neos-ui-error';

import {UserImage} from './UserImage';
import {RestoreButtonItem} from './RestoreButtonItem';

import I18n from '@neos-project/neos-ui-i18n';

import style from './style.module.css';

import {user} from '../../../System';

const withNeosGlobals = neos(globalRegistry => ({
    i18nRegistry: globalRegistry.get('i18n')
}));

const UserDropDown: React.FC<{
    i18nRegistry: I18nRegistry;
    neos: NeosContextInterface;
}> = (props) => {
    const logoutUri = (props.neos?.routes as any)?.core?.logout;
    const userSettingsUri = (props.neos?.routes as any)?.core?.modules?.userSettings;
    const {csrfToken} = document.getElementById('appContainer')!.dataset;

    return (
        <div className={style.wrapper}>
            <DropDown className={style.dropDown}>
                <DropDown.Header className={style.dropDown__btn}>
                    <UserImage
                        userFirstName={user.name.firstName}
                        userLastName={user.name.lastName}
                        />
                    <span className={style.dropDown__userName}>{user.name.fullName}</span>
                </DropDown.Header>
                <DropDown.Contents className={style.dropDown__contents}>
                    <li className={style.dropDown__item}>
                        <a title="User Settings" href={userSettingsUri}>
                            <Icon icon="wrench" aria-hidden="true" className={style.dropDown__itemIcon}/>
                            <I18n id="userSettings.label" sourceName="Modules" packageKey="Neos.Neos" fallback="User Settings"/>
                        </a>
                    </li>
                    <li className={style.dropDown__item}>
                        <form title="Logout" action={logoutUri} method="post" role="presentation">
                            <input type="hidden" name="__csrfToken" value={csrfToken}/>
                            <button onClick={e => e.stopPropagation()} type="submit" name="" value="logout">
                                <Icon icon="sign-out-alt" aria-hidden="true" className={style.dropDown__itemIcon}/>
                                <I18n id="logout" sourceName="Main" packageKey="Neos.Neos" fallback="Logout"/>
                            </button>
                        </form>
                    </li>
                    <RestoreButtonItem
                        i18n={props.i18nRegistry}
                        onLoadError={(message) => showFlashMessage({
                            id: 'impersonateStatusError',
                            severity: 'error',
                            message
                        })}
                        onRestoreSuccess={(message) => showFlashMessage({
                            id: 'restoreUserImpersonateUser',
                            severity: 'success',
                            message
                        })}
                        onRestoreError={(message) => showFlashMessage({
                            id: 'restoreUserImpersonateUser',
                            severity: 'success',
                            message
                        })}
                        />
                </DropDown.Contents>
            </DropDown>
        </div>
    );
}

export default withNeosGlobals(UserDropDown as any);
