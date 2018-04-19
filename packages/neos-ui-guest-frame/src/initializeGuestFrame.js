import {takeEvery, put, select} from 'redux-saga/effects';
import {$get} from 'plow-js';

import {selectors, actions, actionTypes} from '@neos-project/neos-ui-redux-store';
import {requestIdleCallback} from '@neos-project/utils-helpers';

import initializeContentDomNode from './initializeContentDomNode';
import {
    getGuestFrameWindow,
    getGuestFrameDocument,
    findAllNodesInGuestFrame,
    findInGuestFrame,
    findNodeInGuestFrame
} from './dom';

import style from './style.css';

//
// Polyfil for event path
// see: https://stackoverflow.com/questions/39245488/event-path-undefined-with-firefox-and-vue-js
// TODO: extract into helpers if needed elsewhere
//
const eventPath = event => {
    const eventPath = event.path || (event.composedPath && event.composedPath());
    if (eventPath) {
        return eventPath;
    }

    let element = event.target;
    const path = [];

    while (element) {
        path.push(element);
        if (element.tagName === 'HTML') {
            path.push(document);
            path.push(window);
            return path;
        }
        element = element.parentElement;
    }
    return path;
};

export default ({globalRegistry, store}) => function * initializeGuestFrame() {
    const nodeTypesRegistry = globalRegistry.get('@neos-project/neos-ui-contentrepository');
    const inlineEditorRegistry = globalRegistry.get('inlineEditors');
    const guestFrameWindow = getGuestFrameWindow();
    const documentInformation = Object.assign({}, guestFrameWindow['@Neos.Neos.Ui:DocumentInformation']);
    const nodes = Object.assign({}, guestFrameWindow['@Neos.Neos.Ui:Nodes'], {
        [documentInformation.metaData.contextPath]: documentInformation.metaData.documentNodeSerialization
    });

    yield put(actions.CR.Nodes.add(nodes));

    // Remove the inline scripts after initialization
    Array.prototype.forEach.call(guestFrameWindow.document.querySelectorAll('script[data-neos-nodedata]'), element => element.parentElement.removeChild(element));

    yield put(actions.UI.ContentCanvas.setContextPath(documentInformation.metaData.contextPath, documentInformation.metaData.siteNode));
    yield put(actions.UI.ContentCanvas.setPreviewUrl(documentInformation.metaData.previewUrl));
    yield put(actions.CR.ContentDimensions.setActive(documentInformation.metaData.contentDimensions.active));
    // The user may have navigated by clicking an inline link - that's why we need to update the contentCanvas URL to be in sync with the shown content.
    // We need to set the src to the actual src of the iframe, and not retrive it from documentInformation, as it may differ, e.g. contain additional arguments.
    yield put(actions.UI.ContentCanvas.setSrc(guestFrameWindow.document.location.href));

    const focusSelectedNode = event => {
        const clickPath = Array.prototype.slice.call(eventPath(event));
        const isInsideInlineUi = clickPath.some(domNode =>
            domNode &&
            domNode.getAttribute &&
            domNode.getAttribute('data-__neos__inline-ui')
        );
        const isInsideEditableProperty = clickPath.some(domNode =>
            domNode &&
            domNode.getAttribute &&
            domNode.getAttribute('data-__neos-property')
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
            const state = store.getState();
            const focusedNodeContextPath = $get('cr.nodes.focused.contextPath', state);
            if (!isInsideEditableProperty) {
                store.dispatch(actions.UI.ContentCanvas.setCurrentlyEditedPropertyName(''));
            }
            if (!isInsideEditableProperty || focusedNodeContextPath !== contextPath) {
                store.dispatch(actions.CR.Nodes.focus(contextPath, fusionPath));
            }
        } else {
            store.dispatch(actions.UI.ContentCanvas.setCurrentlyEditedPropertyName(''));
            store.dispatch(actions.CR.Nodes.unFocus());
        }
    };

    getGuestFrameDocument().addEventListener('click', e => {
        focusSelectedNode(e);
    });

    getGuestFrameDocument().addEventListener('keyup', e => {
        if (e.key === 'Tab') {
            focusSelectedNode(e);
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

        requestIdleCallback(() => {
            // Only of guest frame document did not change in the meantime, we continue initializing the node
            if (getGuestFrameDocument() === node.ownerDocument) {
                initializeCurrentNode(node);
            }
            initializeSubSequentNodes();
        });
    }, () => { /* This noop function is called right at the end of content inialization */ });

    initializeNodes();

    // When the contentCanvas is reloaded (e.g. from the inspector change) and focused style to it
    const focusedNode = yield select(selectors.CR.Nodes.focusedNodePathSelector);
    const focusedNodeElement = findNodeInGuestFrame(focusedNode);
    if (focusedNodeElement) {
        focusedNodeElement.classList.add(style['markActiveNodeAsFocused--focusedNode']);
        // Request to scroll focused node into view
        yield put(actions.UI.ContentCanvas.requestScrollIntoView(true));
    }

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

    yield takeEvery(actionTypes.CR.Nodes.UNFOCUS, () => {
        const node = findInGuestFrame(`.${style['markActiveNodeAsFocused--focusedNode']}`);

        if (node) {
            node.classList.remove(style['markActiveNodeAsFocused--focusedNode']);
        }
    });
};
