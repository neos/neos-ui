import {$get} from 'plow-js';

import {actions} from '@neos-project/neos-ui-redux-store';

import {getGuestFrameWindow, closestContextPathInGuestFrame} from './dom';

export default ({store, globalRegistry, nodeTypesRegistry, inlineEditorRegistry, nodes}) => propertyDomNode => {
    const guestFrameWindow = getGuestFrameWindow();
    if (!guestFrameWindow['@Neos.Neos.Ui:InitializedInlineEditors']) {
        guestFrameWindow['@Neos.Neos.Ui:InitializedInlineEditors'] = {};
    }

    const initializedInlineEditorApis = guestFrameWindow['@Neos.Neos.Ui:InitializedInlineEditors'];
    const propertyName = propertyDomNode.getAttribute('data-__neos-property');
    const contextPath = closestContextPathInGuestFrame(propertyDomNode);
    const nodeTypeName = $get([contextPath, 'nodeType'], nodes);
    const nodeType = nodeTypesRegistry.get(nodeTypeName);
    const isInlineEditable = $get(['properties', propertyName, 'ui', 'inlineEditable'], nodeType) !== false;

    if (isInlineEditable) {
        const editorIdentifier = nodeTypesRegistry.getInlineEditorIdentifierForProperty(nodeTypeName, propertyName);
        const editorOptions = nodeTypesRegistry.getInlineEditorOptionsForProperty(nodeTypeName, propertyName);
        const {bootstrap, createInlineEditor} = inlineEditorRegistry.get(editorIdentifier);

        if (!initializedInlineEditorApis[editorIdentifier] && bootstrap) {
            try {
                const {
                    setFormattingUnderCursor,
                    setCurrentlyEditedPropertyName
                } = actions.UI.ContentCanvas;

                bootstrap({
                    setFormattingUnderCursor:
                        (...args) => store.dispatch(setFormattingUnderCursor(...args)),
                    setCurrentlyEditedPropertyName:
                        (...args) => store.dispatch(setCurrentlyEditedPropertyName(...args))
                });

                initializedInlineEditorApis[editorIdentifier] = true;
            } catch (err) {
                //
                // The entire function is executed in a saga-context. Since we're fiddeling with the guest
                // frame at this point, there might be plenty of exceptions completely unknown to us, that would
                // become invisible or at least hard to read, if we do not display them explicitly like this.
                //
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
                    actions.Changes.persistChanges([change])
                )
            });
        } catch (err) {
            //
            // The entire function is executed in a saga-context. Since we're fiddeling with the guest
            // frame at this point, there might be plenty of exceptions completely unknown to us, that would
            // become invisible or at least hard to read, if we do not display them explicitly like this.
            //
            console.error(err);
        }
    }
};
