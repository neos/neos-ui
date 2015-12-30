import actions from '../../Actions/';

export default (feedback, envelope, store) => {
    const {documentContextPath, workspaceInfo} = feedback.payload;

    store.dispatch(actions.UI.Tabs.updateWorkspaceInfo(documentContextPath, workspaceInfo));
};
