import {actions} from 'Host/Redux/index';

export default (feedback, envelope, store) => {
    const {workspaceName, workspaceInfo} = feedback.payload;
    store.dispatch(actions.CR.Workspaces.update(workspaceName, workspaceInfo));
};
