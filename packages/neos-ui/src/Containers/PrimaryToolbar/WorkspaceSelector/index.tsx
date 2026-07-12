import React, {useState, useMemo, useCallback} from 'react';
import {connect} from 'react-redux';
import mergeClassNames from 'classnames';

import {translate} from '@neos-project/neos-ui-i18n';
import {actions, GlobalState, selectors} from '@neos-project/neos-ui-redux-store';
import {searchOptions} from '@neos-project/neos-ui-editors/src/Editors/SelectBox/selectBoxHelpers.js';
import {SelectBox, Icon} from '@neos-project/react-ui-components';
import {PublishingMode} from '@neos-project/neos-ui-redux-store/src/CR/Publishing';
import {Node, Workspace, WorkspaceName} from '@neos-project/neos-ui-contentrepository-model';
import {DropDown} from './Components/DropDown';

const {
    publishableNodesSelector,
    baseWorkspaceSelector,
    allowedTargetWorkspacesSelector
} = selectors.CR.Workspaces;

import style from './style.module.css';

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
    const [filterTerm, setFilterTerm] = useState('');

    const hasUnpublishedNodes = publishableNodes?.length > 0;
    const changingWorkspaceAllowed = !isSaving && !isPublishing && !hasUnpublishedNodes;

    const publicWorkspaceGroupLabel = translate('Neos.Neos.Ui:Main:publicWorkspaceGroupLabel', 'Public');
    const internalWorkspaceGroupLabel = translate('Neos.Neos.Ui:Main:internalWorkspaceGroupLabel', 'Internal');
    const readOnlyWorkspaceGroupLabel = translate('Neos.Neos.Ui:Main:readOnlyWorkspaceGroupLabel', 'Read-only');

    const workspacesOptions = useMemo(() => Object.keys(allowedWorkspaces).map((workspaceName) => {
        const workspace = allowedWorkspaces[workspaceName];
        if (!workspace) {
            return {
                label: workspaceName,
                value: workspaceName,
                group: '',
                icon: 'x-mark'
            };
        }
        const group = workspace.readonly ? readOnlyWorkspaceGroupLabel : workspace.name === 'live' ? publicWorkspaceGroupLabel : internalWorkspaceGroupLabel;
        return {
            label: workspace.title,
            value: workspace.name,
            group,
            icon: workspace.readonly ? 'eye' : ''
        };
    }).sort((a, b) => {
        return a.label.localeCompare(b.label);
    }), [allowedWorkspaces]);

    const onWorkspaceSelect = useCallback((workspaceName: string) => {
        if (workspaceName !== baseWorkspace) {
            changeBaseWorkspaceAction(workspaceName);
        }
    }, [baseWorkspace, changeBaseWorkspaceAction]);

    const dropDownButtonStyles = mergeClassNames({
        [style.dropDownButton]: true,
        [style['dropDownButton--isDirty']]: hasUnpublishedNodes,
        [style['dropDownButton--isReadOnly']]: isWorkspaceReadOnly
    });

    const title = changingWorkspaceAllowed ?
        translate('Neos.Neos.Ui:Main:workspaceSelectorTitle', 'Select target workspace') :
        translate('Neos.Neos.Ui:Main:workspaceSelectorTitleDisabled', 'Cannot change target workspace while there are unpublished changes');

    return <DropDown
        id="workspace-selector"
        enabled={changingWorkspaceAllowed}
        buttonTitle={title}
        buttonIcon={<Icon icon="layer-group" padded="right" />}
        buttonLabel={baseWorkspace}
        buttonClassName={dropDownButtonStyles}
        dropDownClassName={style.dropDownContents}
    >
        <SelectBox
            placeholder={translate('Neos.Neos.Ui:Main:filter', 'Filter')}
            placeholderIcon={'filter'}
            displaySearchBox
            searchTerm={filterTerm}
            onSearchTermChange={setFilterTerm}
            threshold={0}
            noMatchesFoundLabel={translate('Neos.Neos.Ui:Main:noMatchesFound')}
            searchBoxLeftToTypeLabel={translate('Neos.Neos.Ui:Main:searchBoxLeftToType')}
            options={searchOptions(filterTerm, workspacesOptions)}
            value={null}
            onValueChange={onWorkspaceSelect}
            disabled={!changingWorkspaceAllowed}
            headerIcon="filter"
            theme={style}
        />
    </DropDown>
}

export default withReduxState(WorkspaceSelector as any);
