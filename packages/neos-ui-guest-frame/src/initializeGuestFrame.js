import {$get} from 'plow-js';
import {put} from 'redux-saga/effects';

import {
    getGuestFrameWindow,
    getGuestFrameDocument,
    getGuestFrameBody,
    findAllNodesInGuestFrame,
    findAllPropertiesInGuestFrame,
    closestContextPathInGuestFrame
} from './dom';

export default ({globalRegistry, store}) => function * initializeGuestFrame() {
    const guestFrameWindow = getGuestFrameWindow();
    const guestFrameDocument = getGuestFrameDocument();
    const documentInformation = Object.assign({}, guestFrameWindow['@Neos.Neos.Ui:DocumentInformation']);
    const nodes = Object.assign({}, guestFrameWindow['@Neos.Neos.Ui:Nodes'], {
        [documentInformation.metaData.contextPath]: documentInformation.metaData.documentNodeSerialization
    });

    yield put(addNodes(nodes));

    yield put(setContextPath(documentInformation.metaData.contextPath, documentInformation.metaData.siteNode));
    yield put(setPreviewUrl(documentInformation.metaData.previewUrl));
    yield put(setActiveDimensions(documentInformation.metaData.contentDimensions.active));

    findAllNodesInGuestFrame().forEach(node => {
        const contextPath = node.getAttribute('data-__neos-node-contextpath');
        const isHidden = $get([contextPath, 'properties', '_hidden'], nodes);

        if (isHidden) {
            // node.classList.add(style.markHiddenNodeAsHidden);
        }

        // initializeHoverHandlersInIFrame(node, guestFrameDocument);
    });

    getGuestFrameBody().addEventListener('click', e => {
        const clickPath = Array.prototype.slice.call(e.path);
        const isInsideInlineUi = clickPath.some(domNode =>
            domNode &&
            domNode.getAttribute &&
            domNode.getAttribute('data-__neos__inlineUI')
        );
        const selectedDomNode = clickPath.find(domNode =>
            domNode &&
            domNode.getAttribute &&
            domNode.getAttribute('data-__neos-node-contextpath')
        );

        if (isInsideInlineUi) {
            // Do nothing, everything OK!
        } else if (selectedDomNode) {
            const contextPath = selectedDomNode.getAttribute('data-__neos-node-contextpath');
            const fusionPath = selectedDomNode.getAttribute('data-__neos-fusion-path');

            // focusNode(contextPath, fusionPath);
        } else {
            // unFocusNode();
        }
    });

    findAllPropertiesInGuestFrame().forEach(propertyNode => {
        const propertyName = propertyNode.getAttribute('data-__neos-property');
        const contextPath = closestContextPathInGuestFrame(propertyNode);
        const nodeType = $get([contextPath, 'nodeType'], nodes);
        const editorIdentifier = $get(['properties', propertyName], globalRegistry.get('nodeTypesRegistry').get())

        const initializeInlineEditor = () => {
            const {top} = propertyNode.getBoundingClientRect();
            const isVisible = top <= window.innerHeight;

            if (isVisible) {

                window.removeEventListener(initializeInlineEditor);
            }
        };
    });
}
