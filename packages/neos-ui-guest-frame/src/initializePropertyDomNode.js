import {$get} from 'plow-js';

import {actions} from '@neos-project/neos-ui-redux-store';

import {getGuestFrameWindow, closestContextPathInGuestFrame} from './dom';

export default ({store, globalRegistry, nodeTypesRegistry, inlineEditorRegistry, nodes}) => propertyDomNode => {
    const guestFrameWindow = getGuestFrameWindow();
    if (!guestFrameWindow['@Neos.Neos.Ui:InitializedInlineEditors']) {
        guestFrameWindow['@Neos.Neos.Ui:InitializedInlineEditors'] = {};
    }

    const initializedInlindeEditorApis = guestFrameWindow['@Neos.Neos.Ui:InitializedInlineEditors'];
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
};
