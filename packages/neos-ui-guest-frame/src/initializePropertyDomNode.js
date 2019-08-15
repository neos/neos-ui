import {$get, $contains} from 'plow-js';

import {actions} from '@neos-project/neos-ui-redux-store';
import {validateElement} from '@neos-project/neos-ui-validators';

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
    const isInlineEditable = (
        $get(['properties', propertyName, 'ui', 'inlineEditable'], nodeType) !== false &&
        !$contains(propertyName, [contextPath, 'policy', 'disallowedProperties'], nodes)
    );

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
            if (!propertyDomNode.dataset.neosInlineEditorIsInitialized) {
                const userPreferences = $get('user.preferences', store.getState());

                createInlineEditor({
                    propertyDomNode,
                    propertyName,
                    contextPath,
                    nodeType,
                    editorOptions,
                    globalRegistry,
                    userPreferences,
                    persistChange: change => store.dispatch(
                        actions.Changes.persistChanges([change])
                    ),
                    onChange: value => {
                        const validationResult = validateElement(value, $get(['properties', propertyName], nodeType), globalRegistry.get('validators'));
                        // Update inline validation errors
                        store.dispatch(
                            actions.CR.Nodes.setInlineValidationErrors(contextPath, propertyName, validationResult)
                        );
                        // If there are no validation errors, update
                        if (validationResult === null) {
                            const change = {
                                type: 'Neos.Neos.Ui:Property',
                                subject: contextPath,
                                payload: {
                                    propertyName,
                                    value,
                                    isInline: true
                                }
                            };
                            store.dispatch(
                                actions.Changes.persistChanges([change])
                            );
                        }
                    }
                });

                propertyDomNode.dataset.neosInlineEditorIsInitialized = true;
            }
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
