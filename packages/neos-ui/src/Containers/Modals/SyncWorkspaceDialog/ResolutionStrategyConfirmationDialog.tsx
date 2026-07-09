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
import {PublishingPhase} from '@neos-project/neos-ui-redux-store/src/CR/Publishing';
import {Conflict, ResolutionStrategy} from '@neos-project/neos-ui-redux-store/src/CR/Syncing';

import {WorkspaceSyncIcon} from '../../PrimaryToolbar/WorkspaceSync';
import {Diagram as DiscardDiagram} from '../PublishingDialog/Diagram';

import {ConflictList} from './ConflictList';
import style from './style.module.css';

export const ResolutionStrategyConfirmationDialog: React.FC<{
    workspaceName: WorkspaceName;
    totalNumberOfChangesInWorkspace: number;
    baseWorkspaceName: WorkspaceName;
    strategy: ResolutionStrategy;
    conflicts: Conflict[];
    onCancelConflictResolution: () => void;
    onConfirmResolutionStrategy: () => void;
}> = (props) => {
    switch (props.strategy) {
        case ResolutionStrategy.FORCE:
            return (<ForceConfirmationDialog {...props} />);
        case ResolutionStrategy.DISCARD_ALL:
        default:
            return (<DiscardAllConfirmationDialog {...props} />);
    }
}

const ForceConfirmationDialog: React.FC<{
    workspaceName: WorkspaceName;
    baseWorkspaceName: WorkspaceName;
    conflicts: Conflict[];
    onCancelConflictResolution: () => void;
    onConfirmResolutionStrategy: () => void;
}> = (props) => {
    return (
        <Dialog
            actions={[
                <Button
                    id="neos-ResolutionStrategyConfirmation-Cancel"
                    key="cancel"
                    style="lighter"
                    hoverStyle="brand"
                    onClick={props.onCancelConflictResolution}
                    >
                    {translate('Neos.Neos.Ui:SyncWorkspaceDialog:resolutionStrategy.FORCE.confirmation.cancel', 'No, cancel')}
                </Button>,
                <Button
                    id="neos-ResolutionStrategyConfirmation-Confirm"
                    key="confirm"
                    style="error"
                    hoverStyle="error"
                    onClick={props.onConfirmResolutionStrategy}
                    className={style.button}
                    >
                    <Icon icon="chevron-right" className={style.icon} />
                    {translate('Neos.Neos.Ui:SyncWorkspaceDialog:resolutionStrategy.FORCE.confirmation.confirm', 'Yes, drop those changes')}
                </Button>
            ]}
            title={
                <div className={style.modalTitle}>
                    <WorkspaceSyncIcon hasProblem onDarkBackground />
                    {translate('Neos.Neos.Ui:SyncWorkspaceDialog:resolutionStrategy.FORCE.confirmation.title', 'Drop conflicting changes in workspace "{workspaceName}"', props as any)}
                </div>
            }
            onRequestClose={props.onCancelConflictResolution}
            type="error"
            isOpen
            autoFocus
            theme={undefined as any}
            style={undefined as any}
        >
            <div className={style.modalContents}>
                {translate('Neos.Neos.Ui:SyncWorkspaceDialog:resolutionStrategy.FORCE.confirmation.conflicts.label', 'You are about to drop the following changes:')}
                <ConflictList
                    conflicts={props.conflicts}
                    />
                {translate('Neos.Neos.Ui:SyncWorkspaceDialog:resolutionStrategy.FORCE.confirmation.message', 'Do you wish to proceed? Be careful: This cannot be undone!')}
            </div>
        </Dialog>
    );
}

const DiscardAllConfirmationDialog: React.FC<{
    workspaceName: WorkspaceName;
    totalNumberOfChangesInWorkspace: number;
    onCancelConflictResolution: () => void;
    onConfirmResolutionStrategy: () => void;
}> = (props) => {
    return (
        <Dialog
            actions={[
                <Button
                    id="neos-ResolutionStrategyConfirmation-Cancel"
                    key="cancel"
                    style="lighter"
                    hoverStyle="brand"
                    onClick={props.onCancelConflictResolution}
                    >
                    {translate('Neos.Neos.Ui:SyncWorkspaceDialog:resolutionStrategy.DISCARD_ALL.confirmation.cancel', 'No, cancel')}
                </Button>,
                <Button
                    id="neos-ResolutionStrategyConfirmation-Confirm"
                    key="confirm"
                    style="error"
                    hoverStyle="error"
                    onClick={props.onConfirmResolutionStrategy}
                    className={style.button}
                    >
                    <Icon icon="trash" className={style.icon} />
                    {translate('Neos.Neos.Ui:SyncWorkspaceDialog:resolutionStrategy.DISCARD_ALL.confirmation.confirm', 'Yes, discard everything')}
                </Button>
            ]}
            title={
                <div className={style.modalTitle}>
                    <WorkspaceSyncIcon hasProblem onDarkBackground />
                    {translate('Neos.Neos.Ui:SyncWorkspaceDialog:resolutionStrategy.DISCARD_ALL.confirmation.title', 'Discard all changes in workspace "{workspaceName}"', props as any)}
                </div>
            }
            onRequestClose={props.onCancelConflictResolution}
            type="error"
            isOpen
            autoFocus
            theme={undefined as any}
            style={undefined as any}
        >
            <div className={style.modalContents}>
                <DiscardDiagram
                    numberOfChanges={props.totalNumberOfChangesInWorkspace}
                    sourceWorkspaceName={props.workspaceName}
                    targetWorkspaceName={null}
                    phase={PublishingPhase.START}
                    />
                {translate('Neos.Neos.Ui:SyncWorkspaceDialog:resolutionStrategy.DISCARD_ALL.confirmation.message', 'You are about to discard all {numberOfChanges} change(s) in workspace "{workspaceName}". This includes all changes on other sites. Do you wish to proceed? Be careful: This cannot be undone!', {numberOfChanges: props.totalNumberOfChangesInWorkspace, workspaceName: props.workspaceName})}
            </div>
        </Dialog>
    );
}
