import React, {PropTypes} from 'react';
import {$get, $transform} from 'plow-js';
import SelectBox from '@neos-project/react-ui-components/lib/SelectBox/';

const WorkspaceSelector = ({allowedWorkspaces, baseWorkspace, changeBaseWorkspaceAction}, context) => {
    const workspacesOptions = Object.keys(allowedWorkspaces).map(i => $transform({label: $get('title'), value: $get('name')}, allowedWorkspaces[i]));
    const onWorkspaceSelect = workspaceName => {
        changeBaseWorkspaceAction(workspaceName);
        context.closeDropDown();
    };
    return (<SelectBox
        options={workspacesOptions}
        onSelect={onWorkspaceSelect}
        value={baseWorkspace}
        />);
};
WorkspaceSelector.propTypes = {
    baseWorkspace: PropTypes.string.isRequired,
    allowedWorkspaces: PropTypes.object.isRequired,
    changeBaseWorkspaceAction: PropTypes.func.isRequired
};
WorkspaceSelector.contextTypes = {
    closeDropDown: PropTypes.func.isRequired
};

export default WorkspaceSelector;
