import {$contains, $get} from 'plow-js';

import {actions, selectors} from '@neos-project/neos-ui-redux-store';
import {validateElement} from '@neos-project/neos-ui-validators';

import {closestContextPathInGuestFrame, getGuestFrameDocument, getGuestFrameWindow} from './dom';

export default ({store, globalRegistry, nodeTypesRegistry, inlineEditorRegistry, nodes}) => propertyDomNode => {
    const guestFrameWindow = getGuestFrameWindow();
    if (!guestFrameWindow['@Neos.Neos.Ui:InitializedInlineEditors']) {
        guestFrameWindow['@Neos.Neos.Ui:InitializedInlineEditors'] = {};
    }

    const initializedInlineEditorApis = guestFrameWindow['@Neos.Neos.Ui:InitializedInlineEditors'];
    const propertyName = propertyDomNode.getAttribute('data-__neos-property');
    const contextPath = closestContextPathInGuestFrame(propertyDomNode);

    if (!nodes[contextPath]) {
        // Node is not available in the store, so we can't initialize the inline editor
        console.warn(`Node with context path "${contextPath}" is not available in the store yet.`);
        return;
    }

    const nodeTypeName = $get([contextPath, 'nodeType'], nodes);
    const nodeType = nodeTypesRegistry.get(nodeTypeName);
    const isInlineEditable = $get(['properties', propertyName, 'ui', 'inlineEditable'], nodeType) !== false;

    // We do not initialize an inline editor for content the user is not
    // allowed to edit (read-only workspace or missing edit permission on the node or
    // property). The server-rendered markup is not editable by itself, which makes
    // not booting the editor the most robust way to prevent editing.
    const isWorkspaceReadOnly = selectors.CR.Workspaces.isWorkspaceReadOnlySelector(store.getState());

    if (!isInlineEditable || isWorkspaceReadOnly) {
        return;
    }

    const initializeInlineEditor = () => {
        const editorIdentifier = 'ckeditor5';
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
    };

    const initializeInlineEditorIfPermitted = policy => {
        const isEditingDisallowed = $get('canEdit', policy) === false ||
            $contains(propertyName, 'disallowedProperties', policy);

        if (!isEditingDisallowed) {
            initializeInlineEditor();
        }
    };

    // The node policy is lazy-loaded after the initial node data arrived in the store, so it is usually not available
    // yet while the guest frame content is initialized. We have to wait for it before we can decide
    // whether an inline editor may be created for this property.
    const selectNodePolicy = () => $get([contextPath, 'policy'], store.getState().cr.nodes.byContextPath);
    const nodePolicy = selectNodePolicy();

    if (nodePolicy) {
        initializeInlineEditorIfPermitted(nodePolicy);
        return;
    }

    const unsubscribe = store.subscribe(() => {
        const nodePolicy = selectNodePolicy();
        if (!nodePolicy) {
            return;
        }

        unsubscribe();

        // The guest frame might have been reloaded while we waited for the policy
        if (getGuestFrameDocument() !== propertyDomNode.ownerDocument) {
            return;
        }

        initializeInlineEditorIfPermitted(nodePolicy);
    });
};
