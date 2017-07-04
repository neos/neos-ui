import {takeEvery} from 'redux-saga';
import {put} from 'redux-saga/effects';

import {actions, actionTypes} from '@neos-project/neos-ui-redux-store';

import initializeContentDomNode from './initializeContentDomNode';
import {
    getGuestFrameWindow,
    getGuestFrameBody,
    findAllNodesInGuestFrame,
    findInGuestFrame,
    findNodeInGuestFrame
} from './dom';

import style from './style.css';

export default ({globalRegistry, store}) => function * initializeGuestFrame() {
    const nodeTypesRegistry = globalRegistry.get('@neos-project/neos-ui-contentrepository');
    const inlineEditorRegistry = globalRegistry.get('inlineEditors');
    const guestFrameWindow = getGuestFrameWindow();
    const documentInformation = Object.assign({}, guestFrameWindow['@Neos.Neos.Ui:DocumentInformation']);
    const nodes = Object.assign({}, guestFrameWindow['@Neos.Neos.Ui:Nodes'], {
        [documentInformation.metaData.contextPath]: documentInformation.metaData.documentNodeSerialization
    });

    yield put(actions.CR.Nodes.add(nodes));

    yield put(actions.UI.ContentCanvas.setContextPath(documentInformation.metaData.contextPath, documentInformation.metaData.siteNode));
    yield put(actions.UI.ContentCanvas.setPreviewUrl(documentInformation.metaData.previewUrl));
    yield put(actions.CR.ContentDimensions.setActive(documentInformation.metaData.contentDimensions.active));

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

            store.dispatch(
                actions.CR.Nodes.focus(contextPath, fusionPath)
            );
        } else {
            store.dispatch(
                actions.CR.Nodes.unFocus()
            );
        }
    });

    const initializeNodes = findAllNodesInGuestFrame().reduceRight((initializeSubSequentNodes, node) => () => {
        const initializeCurrentNode = initializeContentDomNode({
            store,
            globalRegistry,
            nodeTypesRegistry,
            inlineEditorRegistry,
            nodes
        });

        window.requestIdleCallback(() => {
            initializeCurrentNode(node);
            initializeSubSequentNodes();
        });
    }, () => { /* This noop function is called right at the end of content inialization */ });

    initializeNodes();

    yield takeEvery(actionTypes.CR.Nodes.FOCUS, action => {
        const oldNode = findInGuestFrame(`.${style['markActiveNodeAsFocused--focusedNode']}`);

        if (oldNode) {
            oldNode.classList.remove(style['markActiveNodeAsFocused--focusedNode']);
        }

        const {contextPath, fusionPath} = action.payload;

        if (contextPath) {
            const nodeElement = findNodeInGuestFrame(contextPath, fusionPath);

            if (nodeElement) {
                nodeElement.classList.add(style['markActiveNodeAsFocused--focusedNode']);
            }
        }
    });
};
