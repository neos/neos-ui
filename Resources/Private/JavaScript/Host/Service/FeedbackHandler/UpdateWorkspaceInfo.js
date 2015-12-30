import actions from '../../Actions/';

export default (feedback, envelope, store) => {
    const {documentContextPath, workspaceName, workspaceInfo} = feedback.payload;

    store.dispatch(actions.UI.Tabs.updateWorkspaceInfo(documentContextPath, workspaceName, workspaceInfo));
};
