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

import {WorkspaceStatus} from '@neos-project/neos-ts-interfaces';
import I18n from '@neos-project/neos-ui-i18n';
import {Button, Dialog, Icon} from '@neos-project/react-ui-components';

import {WorkspaceSyncIcon} from '../../PrimaryToolbar/WorkspaceSync';

import style from './style.module.css';

const LABELS_BY_WORKSPACE_STATUS = {
    [WorkspaceStatus.UP_TO_DATE]: {
        dialogMessage: {
            id: 'Neos.Neos.Ui:Main:syncPersonalWorkSpaceMessage',
            fallback:
                'It seems like there are changes in the workspace that are not reflected in your personal workspace.\n' +
                'The changes lead to an error state. Please contact your administrator to resolve the problem.'
        }
    },
    [WorkspaceStatus.OUTDATED]: {
        dialogMessage: {
            id: 'Neos.Neos.Ui:Main:syncPersonalWorkSpaceMessageOutdated',
            fallback:
                'It seems like there are changes in the workspace that are not reflected in your personal workspace.\n' +
                'You should synchronize your personal workspace to avoid conflicts.'
        }
    },
    [WorkspaceStatus.OUTDATED_CONFLICT]: {
        dialogMessage: {
            id: 'Neos.Neos.Ui:Main:syncPersonalWorkSpaceMessageOutdatedConflict',
            fallback:
                'It seems like there are changes in the workspace that are not reflected in your personal workspace.\n' +
                'The changes lead to an error state. Please contact your administrator to resolve the problem.'
        }
    }
};

export const ConfirmationDialog: React.FC<{
    workspaceStatus: WorkspaceStatus;
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
                    <I18n id="cancel" fallback="Cancel"/>
                </Button>,
                <Button
                    id="neos-SyncWorkspace-Confirm"
                    key="confirm"
                    style="warn"
                    hoverStyle="warn"
                    onClick={props.onConfirm}
                    >
                    <Icon icon="sync" className={style.buttonIcon}/>
                    <span className={style.confirmText}>
                        <I18n
                            id="Neos.Neos.Ui:Main:syncPersonalWorkSpaceConfirm"
                            fallback="Synchronize now"
                            />
                    </span>
                </Button>
            ]}
            title={
                <div className={style.modalTitle}>
                    <WorkspaceSyncIcon
                        personalWorkspaceStatus={props.workspaceStatus}
                        onDarkBackground
                        />
                    <span>
                        <I18n
                            id="Neos.Neos.Ui:Main:syncPersonalWorkSpace"
                            fallback="Synchronize personal workspace"
                            />
                    </span>
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
                <p>
                    <I18n {...LABELS_BY_WORKSPACE_STATUS[props.workspaceStatus].dialogMessage} />
                </p>
            </div>
        </Dialog>
    );
}
