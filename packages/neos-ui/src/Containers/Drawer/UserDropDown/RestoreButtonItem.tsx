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
    onClick: () => void;
    onError: (message: string) => void;
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
                    props.onError((error as Error).message);
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
                onClick={props.onClick}
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
