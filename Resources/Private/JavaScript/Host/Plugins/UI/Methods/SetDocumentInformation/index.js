import {actions} from 'Host/Redux/index';

export default dispatch => (tabId, documentInformation) => {
    dispatch(actions.UI.ContentView.setContextPath(documentInformation.metaData.contextPath));
    dispatch(actions.UI.ContentView.setPreviewUrl(documentInformation.metaData.previewUrl));

    Object.keys(documentInformation.nodes).forEach(contextPath => {
        const node = documentInformation.nodes[contextPath];
        dispatch(actions.CR.Nodes.add(contextPath, node));
    });
};
