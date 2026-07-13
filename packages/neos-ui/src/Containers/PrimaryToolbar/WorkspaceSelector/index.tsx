import React, {useMemo} from 'react';
import {connect} from 'react-redux';
import mergeClassNames from 'classnames';

import {translate} from '@neos-project/neos-ui-i18n';
import {actions, GlobalState, selectors} from '@neos-project/neos-ui-redux-store';
import {Button, Icon} from '@neos-project/react-ui-components';
import {PublishingMode} from '@neos-project/neos-ui-redux-store/src/CR/Publishing';
import {Node, Workspace, WorkspaceName} from '@neos-project/neos-ui-contentrepository-model';
import {DropDown} from './Components/DropDown';
import style from './style.module.css';
import {List, ListItem} from "../../../SharedComponents";

const POPOVER_ID = "workspace-selector";

const {
    publishableNodesSelector,
    baseWorkspaceSelector,
    allowedTargetWorkspacesSelector
} = selectors.CR.Workspaces;

const withReduxState = connect((state: GlobalState) => ({
    isSaving: state?.ui?.remote?.isSaving,
    isPublishing: state?.cr?.publishing?.mode === PublishingMode.PUBLISH,
    publishableNodes: publishableNodesSelector(state),
    baseWorkspace: baseWorkspaceSelector(state),
    allowedWorkspaces: allowedTargetWorkspacesSelector(state),
    isWorkspaceReadOnly: selectors.CR.Workspaces.isWorkspaceReadOnlySelector(state)
}), {
    changeBaseWorkspaceAction: actions.CR.Workspaces.changeBaseWorkspace,
    start: actions.CR.Publishing.start
});

type WorkspaceSelectorProps = {
    isSaving: boolean,
    isPublishing: boolean,
    publishableNodes: Node[],
    baseWorkspace: WorkspaceName,
    allowedWorkspaces: Record<string, Workspace>,
    changeBaseWorkspaceAction: (workspaceName: string) => void,
    changingWorkspaceAllowed: boolean,
    isWorkspaceReadOnly: boolean
}

const WorkspaceSelector: React.FC<WorkspaceSelectorProps> = ({
    allowedWorkspaces,
    baseWorkspace,
    changeBaseWorkspaceAction,
    isSaving,
    isPublishing,
    publishableNodes,
    isWorkspaceReadOnly
}) => {
    const hasUnpublishedNodes = publishableNodes?.length > 0;
    const changingWorkspaceAllowed = !isSaving && !isPublishing && !hasUnpublishedNodes;

    const baseWorkspaceTitle = allowedWorkspaces[baseWorkspace]?.title ?? baseWorkspace;

    const createChangeBaseWorkspace = React.useCallback((workspaceName) => () => {
        if (workspaceName !== baseWorkspace) {
            changeBaseWorkspaceAction(workspaceName);
        }
    }, [changeBaseWorkspaceAction, baseWorkspace]);

    const rootWorkspaces: Workspace[] = useMemo(() => Object.values(allowedWorkspaces)
        .filter(workspace => workspace.name === 'live')
        .sort((a, b) => a.title.localeCompare(b.title)), [allowedWorkspaces]);

    const readonlyWorkspaces: Workspace[] = useMemo(() => Object.values(allowedWorkspaces)
        .filter(workspace => workspace.readonly)
        .sort((a, b) => a.title.localeCompare(b.title)), [allowedWorkspaces]);

    const regularWorkspaces: Workspace[] = useMemo(() => Object.values(allowedWorkspaces)
        .filter(workspace => workspace.name !== 'live' && !workspace.readonly)
        .sort((a, b) => a.title.localeCompare(b.title)), [allowedWorkspaces]);

    const dropDownButtonStyles = mergeClassNames({
        [style.dropDownButton]: true,
        [style['dropDownButton--isDirty']]: hasUnpublishedNodes || isSaving,
        [style['dropDownButton--isReadOnly']]: isWorkspaceReadOnly,
        [style['dropDownButton--disabled']]: !changingWorkspaceAllowed,
    });

    const title = changingWorkspaceAllowed ?
        translate('Neos.Neos.Ui:Main:workspaceSelectorTitle', 'Select target workspace') :
        translate('Neos.Neos.Ui:Main:workspaceSelectorTitleDisabled', 'Cannot change target workspace while there are unpublished changes');

    // todo add title attributes to workspace things

    return <DropDown
        id={POPOVER_ID}
        enabled={changingWorkspaceAllowed}
        buttonTitle={title}
        buttonIcon={<Icon icon="layer-group" padded="right" />}
        buttonLabel={baseWorkspaceTitle}
        buttonClassName={dropDownButtonStyles}
        dropDownClassName={style.dropDownContents}
        dropDownIconClassName={style.dropDownIcon}
    >
        <List icon="globe" label={translate('Neos.Neos.Ui:Main:publicWorkspaceGroupLabel', 'Public')}>
            {rootWorkspaces.map(workspace => (
                <ListItem key={workspace.name}>
                    <Button
                        disabled={workspace.name === baseWorkspace}
                        onClick={createChangeBaseWorkspace(workspace.name)}
                        style={workspace.name === baseWorkspace ? 'brand' : undefined}
                        className={style.labelEllipsis}
                        popovertarget={POPOVER_ID}
                    >
                        {workspace.title}
                    </Button>
                </ListItem>
            ))}
        </List>

        {regularWorkspaces.length > 0 ? (
            <List icon="layer-group" label={translate('Neos.Neos.Ui:Main:internalWorkspaceGroupLabel', 'Internal')}>
                {regularWorkspaces.map(workspace => (
                    <ListItem key={workspace.name}>
                        <Button
                            disabled={workspace.name === baseWorkspace}
                            onClick={createChangeBaseWorkspace(workspace.name)}
                            style={workspace.name === baseWorkspace ? 'brand' : undefined}
                            className={style.labelEllipsis}
                            popovertarget={POPOVER_ID}
                        >
                            {workspace.title}
                        </Button>
                    </ListItem>
                ))}
            </List>
        ) : ''}

        {readonlyWorkspaces.length > 0 ? (
            <List icon="eye" label={translate('Neos.Neos.Ui:Main:readOnlyWorkspaceGroupLabel', 'Read-only')}>
                {readonlyWorkspaces.map(workspace => (
                    <ListItem key={workspace.name}>
                        <Button
                            disabled={workspace.name === baseWorkspace}
                            onClick={createChangeBaseWorkspace(workspace.name)}
                            style={workspace.name === baseWorkspace ? 'brand' : undefined}
                            className={style.labelEllipsis}
                            popovertarget={POPOVER_ID}
                        >
                            {workspace.title}
                        </Button>
                    </ListItem>
                ))}
            </List>
        ) : ''}
    </DropDown>
}

export default withReduxState(WorkspaceSelector as any);
