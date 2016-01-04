import {actions} from '../../Ducks/';

export default (feedback, envelope, store) => {
    const {documentContextPath, workspaceName, workspaceInfo} = feedback.payload;

    store.dispatch(actions.UI.Tabs.updateWorkspaceInfo(documentContextPath, workspaceName, workspaceInfo));
};
