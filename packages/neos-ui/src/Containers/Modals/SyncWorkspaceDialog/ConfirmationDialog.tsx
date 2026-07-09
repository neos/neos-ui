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

import {WorkspaceName} from '@neos-project/neos-ui-contentrepository-model';
import {translate} from '@neos-project/neos-ui-i18n';
import {Button, Dialog, Icon} from '@neos-project/react-ui-components';
import {SyncingPhase} from '@neos-project/neos-ui-redux-store/src/CR/Syncing';

import {WorkspaceSyncIcon} from '../../PrimaryToolbar/WorkspaceSync';

import {Diagram} from './Diagram';
import style from './style.module.css';

export const ConfirmationDialog: React.FC<{
    workspaceName: WorkspaceName;
    baseWorkspaceName: WorkspaceName;
    onCancel: () => void;
    onConfirm: () => void;
}> = (props) => {
    return (
        <Dialog
            actions={[
                <Button
                    id="neos-SyncWorkspace-Cancel"
                    key="cancel"
                    style="lighter"
                    hoverStyle="brand"
                    onClick={props.onCancel}
                    >
                    {translate('Neos.Neos.Ui:SyncWorkspaceDialog:confirmation.cancel', 'No, cancel')}
                </Button>,
                <Button
                    id="neos-SyncWorkspace-Confirm"
                    key="confirm"
                    style="warn"
                    hoverStyle="warn"
                    onClick={props.onConfirm}
                    className={style.button}
                    >
                    <Icon icon="sync" className={style.icon} />
                    {translate('Neos.Neos.Ui:SyncWorkspaceDialog:confirmation.confirm', 'Yes, synchronize now')}
                </Button>
            ]}
            title={
                <div className={style.modalTitle}>
                    <WorkspaceSyncIcon onDarkBackground />
                    {translate('Neos.Neos.Ui:SyncWorkspaceDialog:confirmation.title', 'Synchronize workspace "{workspaceName}" with "{baseWorkspaceName}"', props as any)}
                </div>
            }
            onRequestClose={props.onCancel}
            type="warn"
            isOpen
            autoFocus
            theme={undefined as any}
            style={undefined as any}
        >
            <div className={style.modalContents}>
                <Diagram
                    workspaceName={props.workspaceName}
                    baseWorkspaceName={props.baseWorkspaceName}
                    phase={SyncingPhase.START}
                    />
                {translate('Neos.Neos.Ui:SyncWorkspaceDialog:confirmation.message', 'Workspace "{baseWorkspaceName}" has been modified. You need to synchronize your workspace "{workspaceName}" with it in order to see those changes and avoid conflicts. Do you wish to proceed?', props as any)}
            </div>
        </Dialog>
    );
}
