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

import {Dialog, Icon} from '@neos-project/react-ui-components';
import I18n from '@neos-project/neos-ui-i18n';
import {SyncingPhase} from '@neos-project/neos-ui-redux-store/src/CR/Syncing';

import {Diagram} from './Diagram';
import style from './style.module.css';

export const ProcessIndicator: React.FC<{
    workspaceName: string;
    baseWorkspaceName: string;
}> = (props) => {
    return (
        <Dialog
            actions={[]}
            title={
                <div className={style.modalTitle}>
                    <Icon icon="refresh" spin />
                    <I18n
                        id="Neos.Neos.Ui:SyncWorkspaceDialog:process.title"
                        params={props}
                        fallback={`Synchronizing workspace "${props.workspaceName}"...`}
                        />
                </div>
            }
            type={undefined as any}
            isOpen
            autoFocus
            preventClosing
            theme={undefined as any}
            style={undefined as any}
        >
            <div className={style.modalContents}>
                <Diagram
                    phase={SyncingPhase.ONGOING}
                    workspaceName={props.workspaceName}
                    baseWorkspaceName={props.baseWorkspaceName}
                    />
                <I18n
                    id="Neos.Neos.Ui:SyncWorkspaceDialog:process.message"
                    params={props}
                    fallback={`Please wait, while workspace "${props.workspaceName}" is being synchronized with recent changes in workspace "${props.baseWorkspaceName}". This may take a while.`}
                    />
            </div>
        </Dialog>
    );
};
