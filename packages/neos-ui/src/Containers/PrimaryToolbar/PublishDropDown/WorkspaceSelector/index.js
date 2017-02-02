import React, {PropTypes} from 'react';
import {$get, $transform} from 'plow-js';
import SelectBox from '@neos-project/react-ui-components/lib/SelectBox/';
import style from './style.css';

const WorkspaceSelector = ({allowedWorkspaces, baseWorkspace, changeBaseWorkspaceAction, changingWorkspaceAllowed, translate}, context) => {
    const workspacesOptions = Object.keys(allowedWorkspaces).map(i => $transform({label: $get('title'), value: $get('name')}, allowedWorkspaces[i]));
    const onWorkspaceSelect = workspaceName => {
        changeBaseWorkspaceAction(workspaceName);
        context.closeDropDown();
    };
    const anyWorkspacesAvailable = Object.keys(allowedWorkspaces).length > 1;
    const baseWorkspaceTitle = $get([baseWorkspace, 'title'], allowedWorkspaces);

    return (<div>
        {anyWorkspacesAvailable && (changingWorkspaceAllowed ?
            <SelectBox
                options={workspacesOptions}
                onSelect={onWorkspaceSelect}
                value={baseWorkspace}
                /> :
            <div className={style.notAllowed} title={translate('Neos.Neos:Main:content.components.dirtyWorkspaceDialog.dirtyWorkspaceContainsChanges')}>
                {baseWorkspaceTitle} – {translate('Neos.Neos:Main:content.components.dirtyWorkspaceDialog.dirtyWorkspaceHeader')}
            </div>
        )}
    </div>);
};
WorkspaceSelector.propTypes = {
    baseWorkspace: PropTypes.string.isRequired,
    allowedWorkspaces: PropTypes.object.isRequired,
    changeBaseWorkspaceAction: PropTypes.func.isRequired,
    changingWorkspaceAllowed: PropTypes.bool,
    translate: PropTypes.func.isRequired
};
WorkspaceSelector.contextTypes = {
    closeDropDown: PropTypes.func.isRequired
};

export default WorkspaceSelector;
