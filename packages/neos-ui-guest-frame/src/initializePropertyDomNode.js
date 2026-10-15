import {actions} from '@neos-project/neos-ui-redux-store';
import {validateElement} from '@neos-project/neos-ui-validators';

import {closestContextPathInGuestFrame, getGuestFrameDocument, getGuestFrameWindow} from './dom';

//
// Inline editors are heavy - especially the CKEditor instance, which we would need to create for
// every single inline editable property of the current document. Therefore, we defer their setup:
// properties that are still waiting for it are marked, and the editors of a content node are
// created once that node enters the viewport.
//
// The deferred initialization is driven by one IntersectionObserver per guest frame, registered at
// most once, plus a safety net for content nodes that have no size to be observed.
//
const guestFramesWithDeferredInitialization = new WeakMap();

const pendingPropertySelector = '[data-__neos-property][data-__neos-editable-node-contextpath][data-neos-inline-editor-initialization-is-pending]';

const isInlineEditable = (nodeTypesRegistry, propertyName, contextPath, nodes) => {
    const nodeTypeName = nodes?.[contextPath]?.nodeType;
    const nodeType = nodeTypesRegistry.get(nodeTypeName);

    return (
        nodeType?.properties?.[propertyName]?.ui?.inlineEditable !== false &&
        !nodes?.[contextPath]?.policy?.disallowedProperties?.includes(propertyName)
    );
};

const initializeInlineEditor = (dependencies, propertyDomNode) => {
    const {store, globalRegistry, nodeTypesRegistry, inlineEditorRegistry} = dependencies;
    const guestFrameWindow = getGuestFrameWindow();
    const propertyName = propertyDomNode.getAttribute('data-__neos-property');
    const contextPath = closestContextPathInGuestFrame(propertyDomNode);
    // The store may have changed since the initialization was deferred
    const nodes = store.getState().cr.nodes.byContextPath;

    if (!nodes[contextPath]) {
        console.warn(`Node with context path "${contextPath}" is not available in the store yet.`);
        return;
    }

    const nodeTypeName = nodes?.[contextPath]?.nodeType;
    const nodeType = nodeTypesRegistry.get(nodeTypeName);

    if (!nodeType) {
        console.warn(`Node type "${nodeTypeName}" is not available in the registry.`);
        return;
    }

    if (!guestFrameWindow['@Neos.Neos.Ui:InitializedInlineEditors']) {
        guestFrameWindow['@Neos.Neos.Ui:InitializedInlineEditors'] = {};
    }

    const initializedInlineEditorApis = guestFrameWindow['@Neos.Neos.Ui:InitializedInlineEditors'];
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
        const userPreferences = store.getState()?.user?.preferences;

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
                const validationResult = validateElement(value, nodeType?.properties?.[propertyName], globalRegistry.get('validators'));
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

        propertyDomNode.dataset.neosInlineEditorIsInitialized = 'true';
    } catch (err) {
        //
        // The entire function is executed in a saga-context. Since we're fiddeling with the guest
        // frame at this point, there might be plenty of exceptions completely unknown to us, that would
        // become invisible or at least hard to read, if we do not display them explicitly like this.
        //
        console.error(err);
    }
};

const findPendingPropertyDomNodesInContentDomNode = contentDomNode => {
    if (!contentDomNode) {
        return [];
    }

    // The content node itself can be an inline editable, which querySelectorAll would not match
    return contentDomNode.matches(pendingPropertySelector) ?
        [contentDomNode, ...contentDomNode.querySelectorAll(pendingPropertySelector)] :
        [...contentDomNode.querySelectorAll(pendingPropertySelector)];
};

const initializePendingInlineEditors = (dependencies, contentDomNode) => {
    findPendingPropertyDomNodesInContentDomNode(contentDomNode).forEach(pendingPropertyDomNode => {
        delete pendingPropertyDomNode.dataset.neosInlineEditorInitializationIsPending;

        initializeInlineEditor(dependencies, pendingPropertyDomNode);
    });
};

const deferInlineEditorInitialization = (dependencies, propertyDomNode) => {
    propertyDomNode.dataset.neosInlineEditorInitializationIsPending = 'true';

    const contentDomNode = propertyDomNode.closest('[data-__neos-node-contextpath]');

    if (!contentDomNode) {
        return;
    }

    const guestFrameDocument = getGuestFrameDocument();

    if (!guestFramesWithDeferredInitialization.has(guestFrameDocument)) {
        const {IntersectionObserver} = getGuestFrameWindow();

        // The inline editors of editable nodes are set up as soon as the node enters the viewport
        // so that all of its inline editable properties - including their placeholders - are ready
        // before the user starts interacting with the node.
        const observer = IntersectionObserver ?
            new IntersectionObserver(entries => {
                const {dependencies: currentDependencies} = guestFramesWithDeferredInitialization.get(guestFrameDocument);

                entries.filter(entry => entry.isIntersecting).forEach(entry => {
                    observer.unobserve(entry.target);

                    initializePendingInlineEditors(currentDependencies, entry.target);
                });
            }, {
                rootMargin: '200% 0px'
            }) :
            null;

        // Safety net for content nodes that never trigger the observer, for example, when they have no size at all.
        const handleInteraction = e => {
            if (!e.target || !e.target.closest) {
                return;
            }

            const interactedContentDomNode = e.target.closest('[data-__neos-node-contextpath]');

            if (!interactedContentDomNode || findPendingPropertyDomNodesInContentDomNode(interactedContentDomNode).length === 0) {
                return;
            }

            if (observer) {
                observer.unobserve(interactedContentDomNode);
            }

            initializePendingInlineEditors(
                guestFramesWithDeferredInitialization.get(guestFrameDocument).dependencies,
                interactedContentDomNode
            );
        };

        guestFrameDocument.addEventListener('mousedown', handleInteraction);
        guestFrameDocument.addEventListener('focusin', handleInteraction);

        guestFramesWithDeferredInitialization.set(guestFrameDocument, {dependencies, observer});
    }

    const {observer} = guestFramesWithDeferredInitialization.get(guestFrameDocument);

    // The observer reports content nodes that are already within the viewport right away
    if (observer) {
        observer.observe(contentDomNode);
    }
};

export default dependencies => propertyDomNode => {
    const {store, nodeTypesRegistry, initializeInlineEditorsImmediately, nodes: precomputedNodes} = dependencies;
    const contextPath = closestContextPathInGuestFrame(propertyDomNode);
    const propertyName = propertyDomNode.getAttribute('data-__neos-property');
    const nodes = precomputedNodes && precomputedNodes[contextPath] ?
        precomputedNodes :
        store.getState().cr.nodes.byContextPath;

    if (!nodes[contextPath]) {
        // Node is not available in the store, so we can't initialize the inline editor
        console.warn(`Node with context path "${contextPath}" is not available in the store yet.`);
        return;
    }

    if (!isInlineEditable(nodeTypesRegistry, propertyName, contextPath, nodes)) {
        return;
    }

    if (propertyDomNode.dataset.neosInlineEditorIsInitialized || propertyDomNode.dataset.neosInlineEditorInitializationIsPending) {
        return;
    }

    if (initializeInlineEditorsImmediately) {
        initializeInlineEditor(dependencies, propertyDomNode);
        return;
    }

    deferInlineEditorInitialization(dependencies, propertyDomNode);
};
