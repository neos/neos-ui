import uuid from 'uuid';
import {actions} from '@neos-project/neos-ui-redux-store';
import manifest from '@neos-project/neos-ui-extensibility';
import {SynchronousRegistry, SynchronousMetaRegistry} from '@neos-project/neos-ui-extensibility/src/registry';

import {configureInlineEditing} from './manifest.inlineEditing';

manifest('main', {}, globalRegistry => {
    //
    // Create Neos UI core registries
    //
    const serverFeedbackHandlers = globalRegistry.add('serverFeedbackHandlers', new SynchronousRegistry(`
        Contains all server feedback handlers.

        The key is the server-feedback-handler-type, and the value is a function with the following signature:

        (feedback, store) => {
            // do whatever you like here :-)
        }
    `));
    const inspector = globalRegistry.add('inspector', new SynchronousMetaRegistry(`
        # Inspector specific registries

        - 'editors' for inspector editors
        - 'saveHooks' for configured side-effects after apply
    `));

    inspector.add('editors', new SynchronousRegistry(`
        Contain all inspector editors.

        The key is an editor name (such as TYPO3.Neos/Inspector/Editors/SelectBoxEditor), and the values
        are objects of the following form:
            {
                component: TextInput // the React editor component to use.

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
    `));

    inspector.add('saveHooks', new SynchronousRegistry(`
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

    //configureInlineEditing(globalRegistry);

    //
    // Register server feedback handlers
    //

    //
    // Take care of message feedback
    //
    const flashMessageFeedbackHandler = (feedbackPayload, store) => {
        const {message, severity} = feedbackPayload;
        const timeout = severity.toLowerCase() === 'success' ? 5000 : 0;
        const id = uuid.v4();

        store.dispatch(actions.UI.FlashMessages.add(id, message, severity, timeout));
    };
    serverFeedbackHandlers.add('Neos.Neos.Ui:Success', flashMessageFeedbackHandler);
    serverFeedbackHandlers.add('Neos.Neos.Ui:Error', flashMessageFeedbackHandler);
    serverFeedbackHandlers.add('Neos.Neos.Ui:Info', feedbackPayload => {
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
    serverFeedbackHandlers.add('Neos.Neos.Ui:UpdateWorkspaceInfo', (feedbackPayload, store) => {
        const {workspaceName, workspaceInfo} = feedbackPayload;
        store.dispatch(actions.CR.Workspaces.update(workspaceName, workspaceInfo));
    });

    //
    // When the server advices to reload the document, just reload it
    //
    serverFeedbackHandlers.add('Neos.Neos.Ui:ReloadDocument', () => {
        [].slice.call(document.querySelectorAll(`iframe[name=neos-content-main]`)).forEach(iframe => {
            const iframeWindow = iframe.contentWindow || iframe;

            iframeWindow.location.href = iframeWindow.location.href;
        });
    });
});
