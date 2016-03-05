import {actions} from 'Host/Redux/';

export default dispatch => (tabId, documentInformation) => {
    dispatch(actions.UI.ContentView.setContextPath(documentInformation.metaData.contextPath));

    Object.keys(documentInformation.nodes).forEach(contextPath => {
        const node = documentInformation.nodes[contextPath];
        dispatch(actions.CR.Nodes.add(contextPath, node));
    });
};
