import {actions} from 'Host/Redux/';

export default dispatch => (tabId, documentInformation) => {
    dispatch(actions.Transient.Nodes.addBulk(documentInformation.nodes));

    dispatch(actions.UI.Tabs.setMetaData(tabId, Object.assign({
        title: tabId,
        workspace: {
            publishableNodes: []
        }
    }, documentInformation.metaData || {})));
};
