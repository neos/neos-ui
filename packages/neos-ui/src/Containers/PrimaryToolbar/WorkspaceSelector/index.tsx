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
import {List, ListItem, Search} from '@neos-project/neos-ui-shared-components';

const POPOVER_ID = 'workspace-selector';

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

const makeSearchWorkspace = (searchValue: string) => (workspace: Workspace) => searchValue !== '' ? workspace.title.toLowerCase().includes(searchValue.toLowerCase()) : true;
const makeSortWorkspace = () => (a: Workspace, b: Workspace) => a.title.localeCompare(b.title);

const WorkspaceSelector: React.FC<WorkspaceSelectorProps> = ({
    allowedWorkspaces,
    baseWorkspace,
    changeBaseWorkspaceAction,
    isSaving,
    isPublishing,
    publishableNodes,
    isWorkspaceReadOnly
}) => {
    const [searchValue, setSearchValue] = React.useState('');

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
        .filter(makeSearchWorkspace(searchValue))
        .sort(makeSortWorkspace()), [allowedWorkspaces, searchValue]);

    const readonlyWorkspaces: Workspace[] = useMemo(() => Object.values(allowedWorkspaces)
        .filter(workspace => workspace.readonly)
        .filter(makeSearchWorkspace(searchValue))
        .sort(makeSortWorkspace()), [allowedWorkspaces, searchValue]);

    const regularWorkspaces: Workspace[] = useMemo(() => Object.values(allowedWorkspaces)
        .filter(workspace => workspace.name !== 'live' && !workspace.readonly)
        .filter(makeSearchWorkspace(searchValue))
        .sort(makeSortWorkspace()), [allowedWorkspaces, searchValue]);

    const dropDownButtonStyles = mergeClassNames({
        [style.dropDownButton]: true,
        [style['dropDownButton--isDirty']]: hasUnpublishedNodes || isSaving,
        [style['dropDownButton--isReadOnly']]: isWorkspaceReadOnly,
        [style['dropDownButton--disabled']]: !changingWorkspaceAllowed
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
        {Object.keys(allowedWorkspaces).length >= 10 ? (
            <div className={style.searchContainer}>
                <Search initialValue={searchValue} onChange={setSearchValue} />
            </div>
        ) : ''}

        {rootWorkspaces.length > 0 ? (
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
        ) : ''}

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
