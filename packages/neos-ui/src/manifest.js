import uuid from 'uuid';
import {Map} from 'immutable';
import {$get} from 'plow-js';

import {actions, selectors} from '@neos-project/neos-ui-redux-store';

import {parentNodeContextPath} from '@neos-project/neos-ui-redux-store/src/CR/Nodes/helpers';

import manifest from '@neos-project/neos-ui-extensibility';
import {SynchronousRegistry, SynchronousMetaRegistry} from '@neos-project/neos-ui-extensibility/src/registry';

import {
    getGuestFrameDocument,
    findNodeInGuestFrame,
    findAllOccurrencesOfNodeInGuestFrame,
    createEmptyContentCollectionPlaceholderIfMissing,
    findAllChildNodes
} from '@neos-project/neos-ui-guest-frame/src/dom';
import initializeContentDomNode from '@neos-project/neos-ui-guest-frame/src/initializeContentDomNode';

import style from '@neos-project/neos-ui-guest-frame/src/style.css';

manifest('main', {}, globalRegistry => {
    //
    // Create edit preview mode registry
    //
    globalRegistry.set('frontendConfiguration', new SynchronousRegistry(`
        # Frontend configuration registry

        Any settings under 'Neos.Neos.Ui.frontendConfiguration' would be available here.
        Might be used also for third parth packages to deliver own settings to the UI, but this is still experimental.
        Settings from each package should be prefixed to avoid collisions (unprefixed settings are reserved for the core UI itself), e.g.:

        Neos:
            Neos:
                Ui:
                    frontendConfiguration:
                        'Your.Own:Package':
                            someKey: someValue

        Then it may be accessed as:

        globalRegistry.get('frontendConfiguration').get('Your.Own:Package').someKey
    `));

    //
    // Create inline editor registry
    //
    globalRegistry.set('inlineEditors', new SynchronousRegistry(`
        # Registry for inline editors

        Each key in this registry should be a unique identifier for an inline editor, that can be referenced in a node type configuration.
        Each entry in this registry is supposed to consist of an object with the following structure:

        {
            bootstrap: myBootstrapFunction,
            createInlineEditor: myInlineEditorFactoryFunction
        }

        \`bootstrap\` is called only once during the global initialization of the guest frame. It is not required to do
        anything in this function, but it is possible to prepare the guest frame environment, if any global variables
        must be defined or other initialization routines must be run in order for the inline editor to work.

        \`bootstrap\` will receive an API Object as its first parameter, with the following methods:

            - setFormattingUnderCursor: Will dispatch the respective action in from '@neos-project/neos-ui-redux-store' package (actions.UI.ContentCanvas.setFormattingUnderCursor)
            - setCurrentlyEditedPropertyName: Will dispatch the respective action in from '@neos-project/neos-ui-redux-store' package (actions.UI.ContentCanvas.setCurrentlyEditedPropertyName)

        \`createInlineEditor\` is called on every dom node in the guest frame that represents an editable property. It
        is supposed to handle the initialization and display of an inline editor.

        \`createInlineEditor\` will receive an object as its first parameter, with the following properties:

            - propertyDomNode: The DOM node associated with the editable property
            - propertyName: The name of the editable property
            - contextPath: The contextPath of the associated node
            - nodeType: The nodeType of the associated node
            - editorOptions: The configuration for this inline editor
            - globalRegistry: The global registry
            - persistChange: Will dispatch the respective action in from '@neos-project/neos-ui-redux-store' package (actions.Changes.persistChanges)
    `));

    //
    // Create Inspector meta registry
    //
    const inspector = globalRegistry.set('inspector', new SynchronousMetaRegistry(`
        # Inspector specific registries

        - 'editors' for inspector editors
        - 'views' for inspector views
        - 'saveHooks' for configured side-effects after apply
    `));

    inspector.set('editors', new SynchronousRegistry(`
        Contains all inspector editors.

        The key is an editor name (such as Neos.Neos/Inspector/Editors/SelectBoxEditor), and the values
        are objects of the following form:
            {
                component: TextInput // the React editor component to use. Required.

                hasOwnLabel: true|false // does the component render the label internally, or not?
            }

        ## Component Wiring

        Every component gets the following properties (see EditorEnvelope/index.js)

        - identifier: an identifier which can be used for HTML ID generation
        - label: the label
        - node: the current node
        - value: The value to display
        - propertyName: Name of the property to edit (of the node)
        - options: additional editor options
        - commit: a callback function when the content changes.
          - 1st argument: the new value
          - 2nd argument (optional): an object whose keys are to-be-triggered *saveHooks*, and the values
            are hook-specific options.
            Example: {'Neos.UI:Hook.BeforeSave.CreateImageVariant': nextImage}
        - renderSecondaryInspector(inspectorIdentifier, secondaryInspectorComponentFactory):
          - 1st argument: a string identifier of the inspector; used to implement toggling of the inspector when calling this method twice.
          - 2nd argument: a callback function which can be used to render the secondary inspector. The callback function should return the secondary inspector content itself; or "undefined/null" to close the secondary inspector.

            Example usage: props.renderSecondaryInspector('IMAGE_CROPPING', () => <MySecondaryInspectorContent />)

    `));

    inspector.set('secondaryEditors', new SynchronousRegistry(`
        Contains all secondary inspector editors, which can be used to provide additional, more complex functionality
        that needs more space of the UI than the inspector panel can provide itself.

        Use it like the registry for editors.
    `));

    inspector.set('views', new SynchronousRegistry(`
        Contains all inspector views.

        Use it like the registry for editors.
    `));

    inspector.set('saveHooks', new SynchronousRegistry(`
        Sometimes, it is needed to run code when the user presses "Apply" inside the Inspector.

        Example: When the user cropped a new image, on Apply, a new imageVariant must be created on the server,
        and then the identity of the new imageVariant must be stored inside the Value of the image.

        The process is as follows:
        - When an editor wants its value to be post-processed, it calls \`props.commit(newValue, {hookName: hookOptions})\`
        - Then, when pressing Apply in the UI, the hookNames are resolved inside this \`saveHooks\` registry.

        ## Hook Definitions

        Every entry inside this registry is a function of the following signature:

        (valueSoFar, hookOptions) => {
            return new value,
            can also return a new Promise.
        }
    `));

    //
    // Create validators registry
    //
    globalRegistry.set('validators', new SynchronousRegistry(`
        Contains all validators.

        The key is a validator name (such as Neos.Neos/Validation/NotEmptyValidator) and the values
        are validator options.
    `));

    //
    // Create server feedback handlers registry
    //

    const serverFeedbackHandlers = globalRegistry.set('serverFeedbackHandlers', new SynchronousRegistry(`
        Contains all server feedback handlers.

        The key is the server-feedback-handler-type, and the value is a function with the following signature:

        (feedback, store) => {
            // do whatever you like here :-)
        }
    `));

    //
    // Register server feedback handlers
    //

    //
    // Take care of message feedback
    //
    const flashMessageFeedbackHandler = (feedbackPayload, {store}) => {
        const {message, severity} = feedbackPayload;
        const timeout = severity.toLowerCase() === 'success' ? 5000 : 0;
        const id = uuid.v4();

        store.dispatch(actions.UI.FlashMessages.add(id, message, severity, timeout));
    };
    serverFeedbackHandlers.set('Neos.Neos.Ui:Success/Main', flashMessageFeedbackHandler);
    serverFeedbackHandlers.set('Neos.Neos.Ui:Error/Main', flashMessageFeedbackHandler);
    serverFeedbackHandlers.set('Neos.Neos.Ui:Info/Main', feedbackPayload => {
        switch (feedbackPayload.severity) {
            case 'ERROR':
                console.error(feedbackPayload.message);
                break;

            default:
                console.info(feedbackPayload.message);
                break;
        }
    });

    //
    // When the server advices to update the workspace information, dispatch the action to do so
    //
    serverFeedbackHandlers.set('Neos.Neos.Ui:UpdateWorkspaceInfo/Main', (feedbackPayload, {store}) => {
        store.dispatch(actions.CR.Workspaces.update(feedbackPayload));
    });

    //
    // When the server advices to reload the children of a document node, dispatch the action to do so.
    //
    serverFeedbackHandlers.set('Neos.Neos.Ui:NodeCreated/Main', (feedbackPayload, {store}) => {
        if (feedbackPayload.isDocument) {
            store.dispatch(actions.UI.Remote.documentNodeCreated(feedbackPayload.contextPath));
        }
    });

    //
    // When the server advices to reload the document, just reload it
    //
    serverFeedbackHandlers.set('Neos.Neos.Ui:ReloadDocument/Main', (feedbackPayload, {store}) => {
        const currentIframeUrl = $get('ui.contentCanvas.src', store.getState());

        [].slice.call(document.querySelectorAll(`iframe[name=neos-content-main]`)).forEach(iframe => {
            const iframeWindow = iframe.contentWindow || iframe;

            //
            // Make sure href is still consistent before reloading - if not, some other process
            // might be already handling this
            //
            if (iframeWindow.location.href === currentIframeUrl) {
                iframeWindow.location.href = iframeWindow.location.href;
            }
        });
    });

    //
    // When the server has updated node info, apply it to the store
    //
    serverFeedbackHandlers.set('Neos.Neos.Ui:UpdateNodeInfo/Main', (feedbackPayload, {store}) => {
        store.dispatch(actions.CR.Nodes.add(feedbackPayload.byContextPath));
    });

    //
    // When the server has removed a node, remove it as well from the store amd the dom
    //
    serverFeedbackHandlers.set('Neos.Neos.Ui:RemoveNode/Main', ({contextPath, parentContextPath}, {store}) => {
        const state = store.getState();
        if ($get('cr.nodes.focused.contextPath', state) === contextPath) {
            store.dispatch(actions.CR.Nodes.unFocus());
        }

        if ($get('ui.pageTree.isFocused', state) === contextPath) {
            store.dispatch(actions.UI.PageTree.focus(parentContextPath));
        }

        // If we are removing current document node...
        if ($get('ui.contentCanvas.contextPath', state) === contextPath) {
            let redirectContextPath = contextPath;
            let redirectUri = null;
            // Determine closest parent that is not being removed
            while (!redirectUri) {
                redirectContextPath = parentNodeContextPath(redirectContextPath);
                // This is an extreme case when even the top node does not exist in the given dimension
                // TODO: still find a nicer way to break out of this situation
                if (redirectContextPath === false) {
                    window.location = '/neos!';
                    break;
                }
                redirectUri = $get(['cr', 'nodes', 'byContextPath', redirectContextPath, 'uri'], state);
            }

            store.dispatch(actions.UI.ContentCanvas.setSrc(redirectUri));
            store.dispatch(actions.UI.ContentCanvas.setContextPath(redirectContextPath));
        }

        store.dispatch(actions.CR.Nodes.remove(contextPath));

        // Remove the node from the dom
        if ($get('ui.contentCanvas.contextPath', state) !== contextPath) {
            findAllOccurrencesOfNodeInGuestFrame(contextPath).forEach(el => {
                const closestContentCollection = el.closest('.neos-contentcollection');
                el.remove();

                createEmptyContentCollectionPlaceholderIfMissing(closestContentCollection);
            });
        }
    });

    //
    // When the server advices to render a new node, put the delivered html to the
    // corrent place inside the DOM
    //
    serverFeedbackHandlers.set('Neos.Neos.Ui:RenderContentOutOfBand/Main', (feedbackPayload, {store, globalRegistry}) => {
        const {contextPath, renderedContent, parentDomAddress, siblingDomAddress, mode} = feedbackPayload;
        const parentElement = parentDomAddress && findNodeInGuestFrame(
            parentDomAddress.contextPath,
            parentDomAddress.fusionPath
        );
        const siblingElement = siblingDomAddress && findNodeInGuestFrame(
            siblingDomAddress.contextPath,
            siblingDomAddress.fusionPath
        );
        const contentElement = (new DOMParser())
            .parseFromString(renderedContent, 'text/html')
            .querySelector(`[data-__neos-node-contextpath="${contextPath}"]`);

        if (!contentElement) {
            console.warn(`!!! Content Element with context path "${contextPath}" not found in returned HTML from server (which you see below) - Reloading the full page!`);
            console.log(renderedContent);

            getGuestFrameDocument().location.reload();
            return;
        }

        const fusionPath = contentElement.dataset.__neosFusionPath;

        switch (mode) {
            case 'before':
                siblingElement.parentNode.insertBefore(contentElement, siblingElement);
                break;

            case 'after':
                siblingElement.parentNode.insertBefore(contentElement, siblingElement.nextSibling);
                break;

            case 'into':
            default:
                parentElement.appendChild(contentElement);
                break;
        }

        const children = findAllChildNodes(contentElement);

        const nodes = new Map(
            Object.assign(
                {[contextPath]: selectors.CR.Nodes.byContextPathSelector(contextPath)(store.getState())},
                ...children.map(el => {
                    const contextPath = el.getAttribute('data-__neos-node-contextpath');
                    return {[contextPath]: selectors.CR.Nodes.byContextPathSelector(contextPath)(store.getState())};
                })
            )
        );
        const nodeTypesRegistry = globalRegistry.get('@neos-project/neos-ui-contentrepository');
        const inlineEditorRegistry = globalRegistry.get('inlineEditors');

        if (parentElement.querySelector(`.${style.addEmptyContentCollectionOverlay}`)) {
            parentElement.querySelector(`.${style.addEmptyContentCollectionOverlay}`).remove();
        }

        //
        // Initialize the newly rendered node and all nodes that came with it
        //
        [contentElement, ...children].forEach(
            initializeContentDomNode({
                store,
                globalRegistry,
                nodeTypesRegistry,
                inlineEditorRegistry,
                nodes
            })
        );
        store.dispatch(actions.CR.Nodes.focus(contextPath, fusionPath));
        store.dispatch(actions.UI.ContentCanvas.requestScrollIntoView(true));
    });

    //
    // Create container registry
    //
    globalRegistry.set('containers', new SynchronousRegistry(`
        # Container Registry
    `));
});

require('./manifest.containers');
require('./manifest.dataloaders');
