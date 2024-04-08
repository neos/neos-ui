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

import I18n from '@neos-project/neos-ui-i18n';
import {I18nRegistry, WorkspaceName} from '@neos-project/neos-ts-interfaces';
import {Button, Dialog, Icon, SelectBox, SelectBox_Option_MultiLineWithThumbnail} from '@neos-project/react-ui-components';
import {Conflict, ResolutionStrategy, SyncingPhase} from '@neos-project/neos-ui-redux-store/src/CR/Syncing';

import {WorkspaceSyncIcon} from '../../PrimaryToolbar/WorkspaceSync';

import {ConflictList} from './ConflictList';
import {Diagram} from './Diagram';
import style from './style.module.css';

const VARIANTS_BY_RESOLUTION_STRATEGY = {
    [ResolutionStrategy.FORCE]: {
        icon: 'puzzle-piece',
        labels: {
            label: {
                id: 'Neos.Neos.Ui:SyncWorkspaceDialog:resolutionStrategy.selection.option.FORCE.label',
                fallback: () => 'Drop conflicting changes'
            },
            description: {
                id: 'Neos.Neos.Ui:SyncWorkspaceDialog:resolutionStrategy.selection.option.FORCE.description',
                fallback: 'This will save all non-conflicting changes, while every conflicting change will be lost.'
            }
        }
    },
    [ResolutionStrategy.DISCARD_ALL]: {
        icon: 'trash',
        labels: {
            label: {
                id: 'Neos.Neos.Ui:SyncWorkspaceDialog:resolutionStrategy.selection.option.DISCARD_ALL.label',
                fallback: (props: {workspaceName: WorkspaceName}) =>
                    `Discard workspace "${props.workspaceName}"`
            },
            description: {
                id: 'Neos.Neos.Ui:SyncWorkspaceDialog:resolutionStrategy.selection.option.DISCARD_ALL.description',
                fallback: 'This will discard all changes in your workspace, including those on other sites.'
            }
        }
    }
} as const;

const OPTIONS_FOR_RESOLUTION_STRATEGY_SELECTION = [
    {
        value: ResolutionStrategy.FORCE
    },
    {
        value: ResolutionStrategy.DISCARD_ALL
    }
] as const;

export const ResolutionStrategySelectionDialog: React.FC<{
    workspaceName: WorkspaceName;
    baseWorkspaceName: WorkspaceName;
    conflicts: Conflict[];
    defaultStrategy: null | ResolutionStrategy;
    i18n: I18nRegistry;
    onCancel: () => void;
    onSelectResolutionStrategy: (strategy: ResolutionStrategy) => void;
}> = (props) => {
    const [
        selectedResolutionStrategy,
        setSelectedResolutionStrategy
    ] = React.useState(props.defaultStrategy ?? ResolutionStrategy.FORCE);
    const options = React.useMemo(() => {
        return OPTIONS_FOR_RESOLUTION_STRATEGY_SELECTION
            .map(({value}) => {
                const variant = VARIANTS_BY_RESOLUTION_STRATEGY[value];
                const params = {
                    workspaceName: props.workspaceName
                };

                return {
                    value: String(value),
                    icon: variant.icon,
                    label: props.i18n.translate(
                        variant.labels.label.id,
                        variant.labels.label.fallback(params),
                        params
                    ),
                    description: props.i18n.translate(
                        variant.labels.description.id,
                        variant.labels.description.fallback
                    )
                };
            })
    }, [props.i18n, props.workspaceName]);
    const handleSelectResolutionStrategy = React.useCallback((value: string) => {
        setSelectedResolutionStrategy(parseInt(value, 10));
    }, []);
    const handleConfirm = React.useCallback(() => {
        props.onSelectResolutionStrategy(selectedResolutionStrategy);
    }, [selectedResolutionStrategy]);

    return (
        <Dialog
            actions={[
                <Button
                    id="neos-SelectResolutionStrategy-Cancel"
                    key="cancel"
                    style="lighter"
                    hoverStyle="brand"
                    onClick={props.onCancel}
                    >
                    <I18n
                        id="Neos.Neos.Ui:SyncWorkspaceDialog:resolutionStrategy.selection.cancel"
                        fallback="Cancel Synchronization"
                        />
                </Button>,
                <Button
                    id="neos-SelectResolutionStrategy-Accept"
                    key="confirm"
                    style="warn"
                    hoverStyle="warn"
                    onClick={handleConfirm}
                    className={style.button}
                    >
                    <I18n
                        id="Neos.Neos.Ui:SyncWorkspaceDialog:resolutionStrategy.selection.accept"
                        fallback="Accept choice and continue"
                        />
                    <Icon icon="chevron-right" className={style.icon} />
                </Button>
            ]}
            title={
                <div className={style.modalTitle}>
                    <WorkspaceSyncIcon hasProblem onDarkBackground />
                    <I18n
                        id="Neos.Neos.Ui:SyncWorkspaceDialog:resolutionStrategy.selection.title"
                        fallback={`Conflicts between workspace "${props.workspaceName}" and "${props.baseWorkspaceName}"`}
                        params={props}
                        />
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
                    phase={SyncingPhase.CONFLICT}
                    />
                <I18n
                    id="Neos.Neos.Ui:SyncWorkspaceDialog:resolutionStrategy.selection.message"
                    fallback={`Workspace "${props.baseWorkspaceName}" contains modifications that are in conflict with the changes in workspace "${props.workspaceName}".`}
                    params={props}
                    />
                <details className={style.details}>
                    <summary className={style.summary}>
                        <I18n
                            id="Neos.Neos.Ui:SyncWorkspaceDialog:resolutionStrategy.selection.summary"
                            fallback={`Show information about ${props.conflicts.length} conflict(s)`}
                            params={{numberOfConflicts: props.conflicts.length}}
                            />
                    </summary>
                    <ConflictList
                        conflicts={props.conflicts}
                        i18n={props.i18n}
                        />
                </details>
                <I18n
                    id="Neos.Neos.Ui:SyncWorkspaceDialog:resolutionStrategy.selection.prompt"
                    fallback="In order to proceed, you need to decide what to do with the conflicting changes:"
                    />
                <SelectBox
                    options={options}
                    value={String(selectedResolutionStrategy)}
                    onValueChange={handleSelectResolutionStrategy}
                    ListPreviewElement={ResolutionStrategyOption}
                    />
            </div>
        </Dialog>
    );
}

const ResolutionStrategyOption: React.FC<{
    option: {
        value: ResolutionStrategy;
        icon: string;
        label: string;
        description: string;
    };
}> = (props) => (
    <SelectBox_Option_MultiLineWithThumbnail
        {...props}
        icon={props.option.icon}
        label={props.option.label}
        secondaryLabel={props.option.description}
        />
);
