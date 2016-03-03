import {actions} from 'Host/Redux/';

export default dispatch => (tabId, documentInformation) => {
    Object.keys(documentInformation.nodes).forEach(contextPath => {
        const node = documentInformation.nodes[contextPath];
        dispatch(actions.CR.Nodes.add(contextPath, node));
    });
};
