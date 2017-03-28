import {$get} from 'plow-js';
import {put} from 'redux-saga/effects';

import {actions} from '@neos-project/neos-ui-redux-store';

import {
    getGuestFrameWindow,
    getGuestFrameDocument,
    getGuestFrameBody,
    findAllNodesInGuestFrame,
    findAllPropertiesInGuestFrame,
    closestContextPathInGuestFrame
} from './dom';

import style from './style.css';

export default ({globalRegistry, store}) => function * initializeGuestFrame() {
    const nodeTypesRegistry = globalRegistry.get('@neos-project/neos-ui-contentrepository');
    const inlineEditorRegistry = globalRegistry.get('inlineEditorRegistry');
    const guestFrameWindow = getGuestFrameWindow();
    const guestFrameDocument = getGuestFrameDocument();
    const documentInformation = Object.assign({}, guestFrameWindow['@Neos.Neos.Ui:DocumentInformation']);
    const nodes = Object.assign({}, guestFrameWindow['@Neos.Neos.Ui:Nodes'], {
        [documentInformation.metaData.contextPath]: documentInformation.metaData.documentNodeSerialization
    });

    yield put(actions.CR.Nodes.add(nodes));

    yield put(actions.UI.ContentCanvas.setContextPath(documentInformation.metaData.contextPath, documentInformation.metaData.siteNode));
    yield put(actions.UI.ContentCanvas.setPreviewUrl(documentInformation.metaData.previewUrl));
    yield put(actions.CR.ContentDimensions.setActive(documentInformation.metaData.contentDimensions.active));

    findAllNodesInGuestFrame().forEach(node => {
        const contextPath = node.getAttribute('data-__neos-node-contextpath');
        const isHidden = $get([contextPath, 'properties', '_hidden'], nodes);

        if (isHidden) {
            node.classList.add(style.markHiddenNodeAsHidden);
        }

        node.addEventListener('mouseenter', e => {
            const oldNode = guestFrameDocument.querySelector(`.${style.markHoveredNodeAsHovered}`);
            if (oldNode) {
                oldNode.classList.remove(style.markHoveredNodeAsHovered);
            }

            node.classList.add(style.markHoveredNodeAsHovered);

            e.stopPropagation();
        });

        node.addEventListener('mouseleave', e => {
            node.classList.remove(style.markHoveredNodeAsHovered);

            e.stopPropagation();
        });
    });

    const initializedInlindeEditorApis = {};
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

    findAllPropertiesInGuestFrame().forEach(propertyDomNode => {
        const propertyName = propertyDomNode.getAttribute('data-__neos-property');
        const contextPath = closestContextPathInGuestFrame(propertyDomNode);
        const nodeTypeName = $get([contextPath, 'nodeType'], nodes);
        const nodeType = nodeTypesRegistry.get(nodeTypeName);
        const isInlineEditable = $get(['properties', propertyName, 'ui', 'inlineEditable'], nodeType) !== false;

        if (isInlineEditable) {
            const editorIdentifier = nodeTypesRegistry.getInlineEditorForProperty(nodeTypeName, propertyName);
            const editorOptions = nodeTypesRegistry.getInlineEditorOptionsForProperty(nodeTypeName, propertyName);
            const {initializeInlineEditorApi, createInlineEditor} = inlineEditorRegistry.get(editorIdentifier);

            const initializeInlineEditor = () => {
                const {top} = propertyDomNode.getBoundingClientRect();
                const isVisible = top <= window.innerHeight;

                if (isVisible) {
                    if (!initializedInlindeEditorApis[editorIdentifier] && initializeInlineEditorApi) {
                        try {
                            const {
                                setFormattingUnderCursor,
                                setCurrentlyEditedPropertyName
                            } = actions.UI.ContentCanvas;

                            initializeInlineEditorApi({
                                setFormattingUnderCursor:
                                    (...args) => store.dispatch(setFormattingUnderCursor(...args)),
                                setCurrentlyEditedPropertyName:
                                    (...args) => store.dispatch(setCurrentlyEditedPropertyName(...args))
                            });

                            initializedInlindeEditorApis[editorIdentifier] = true;
                        } catch (err) {
                            console.error(err);
                        }
                    }

                    try {
                        createInlineEditor({
                            propertyDomNode,
                            propertyName,
                            contextPath,
                            nodeType,
                            editorOptions,
                            globalRegistry,
                            persistChange: change => store.dispatch(
                                actions.Changes.persistChange(change)
                            )
                        });
                    } catch (err) {
                        console.error(err);
                    }

                    guestFrameWindow.removeEventListener('scroll', initializeInlineEditor);
                }
            };

            guestFrameWindow.addEventListener('scroll', initializeInlineEditor);
            initializeInlineEditor();
        }
    });
};
