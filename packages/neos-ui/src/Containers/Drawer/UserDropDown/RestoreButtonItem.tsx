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

import {Icon} from '@neos-project/react-ui-components';
import I18n from '@neos-project/neos-ui-i18n';
import {I18nRegistry} from '@neos-project/neos-ts-interfaces';
import backend from '@neos-project/neos-ui-backend-connector';

import {routes} from '../../../System';

import buttonTheme from './style.module.css';

type ImpersonateAccount = {
    accountIdentifier: string;
    fullName: string;
};

type ImpersonateStatus = {
    status: boolean;
    user?: ImpersonateAccount;
    origin?: ImpersonateAccount;
};

export const RestoreButtonItem: React.FC<{
    originUser?: {
        fullName: string;
    };
    onLoadError: (message: string) => void;
    onRestoreSuccess: (message: string) => void;
    onRestoreError: (message: string) => void;
    i18n: I18nRegistry;
}> = (props) => {
    const [impersonateStatus, setImpersonateStatus] = React.useState<null | ImpersonateStatus>(null);
    const title = props.i18n.translate(
        'impersonate.title.restoreUserButton',
        'Switch back to the orginal user account',
        {},
        'Neos.Neos',
        'Main'
    );
    const errorMessage = props.i18n.translate(
        'impersonate.error.restoreUser',
        'Could not switch back to the original user.',
        {},
        'Neos.Neos',
        'Main'
    );
    const handleClick = React.useCallback(
        async function restoreOriginalUser() {
            const {impersonateRestore} = backend.get().endpoints;
            const feedback = await impersonateRestore();
            const originUser = feedback?.origin?.accountIdentifier;
            const user = feedback?.impersonate?.accountIdentifier;
            const status = feedback?.status;

            const restoreMessage = props.i18n.translate(
                'impersonate.success.restoreUser',
                'Switched back from {0} to the orginal user {1}.',
                {
                    0: user,
                    1: originUser
                },
                'Neos.Neos',
                'Main'
            );

            if (status) {
                props.onRestoreSuccess(restoreMessage);
            } else {
                props.onRestoreError(errorMessage);
            }

            window.location.href = routes?.core?.modules?.defaultModule;
        },
        [props.i18n]
    );

    React.useEffect(
        () => {
            (async function loadImpersonateStatus(): Promise<void> {
                try {
                    const {impersonateStatus: fetchImpersonateStatus} =
                        backend.get().endpoints;
                    const impersonateStatus: null|ImpersonateStatus =
                        await fetchImpersonateStatus();

                    if (impersonateStatus) {
                        setImpersonateStatus(impersonateStatus);
                    }
                } catch (error) {
                    props.onLoadError((error as Error).message);
                }
            })();
        },
        []
    );

    if (impersonateStatus?.status !== true) {
        return null;
    }

    if (!impersonateStatus.origin) {
        return null;
    }

    return (
        <li className={buttonTheme.dropDown__item}>
            <button
                title={title}
                onClick={handleClick}
            >
                <Icon
                    icon="random"
                    aria-hidden="true"
                    className={buttonTheme.dropDown__itemIcon}
                />
                <I18n
                    id="impersonate.label.restoreUserButton"
                    sourceName="Main"
                    packageKey="Neos.Neos"
                    fallback={`Back to user "${impersonateStatus.origin.fullName}"`}
                    params={{0: impersonateStatus.origin.fullName}}
                />
            </button>
        </li>
    );
}
