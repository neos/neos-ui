import uuid from 'uuid';

import IconButton from '@neos-project/react-ui-components/lib/IconButton/';
import StyleSelect from './Containers/SecondaryToolbar/EditorToolbar/StyleSelect';

import {actions} from '@neos-project/neos-ui-redux-store';
import manifest from '@neos-project/neos-ui-extensibility';
import {SynchronousRegistry, SynchronousMetaRegistry} from '@neos-project/neos-ui-extensibility/src/registry';

import {RichTextToolbarRegistry} from './Registry';

manifest('main', {}, globalRegistry => {
    //
    // Create Inspector meta registry
    //
    const inspector = globalRegistry.add('inspector', new SynchronousMetaRegistry(`
        # Inspector specific registries

        - 'editors' for inspector editors
        - 'saveHooks' for configured side-effects after apply
    `));

    inspector.add('editors', new SynchronousRegistry(`
        Contains all inspector editors.

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
        - renderSecondaryInspector(inspectorIdentifier, secondaryInspectorComponentFactory):
          - 1st argument: a string identifier of the inspector; used to implement toggling of the inspector when calling this method twice.
          - 2nd argument: a callback function which can be used to render the secondary inspector. The callback function should return the secondary inspector content itself; or "undefined/null" to close the secondary inspector.

          Example usage: props.renderSecondaryInspector('IMAGE_CROPPING', () => <MySecondaryInspectorContent />)

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

    //
    // Create richtext editing toolbar registry
    //

    const richtextToolbar = globalRegistry.add('richtextToolbar', new RichTextToolbarRegistry(`
        Contains the Rich Text Editing Toolbar components.

        The values are objects of the following form:

            {
                formatting: 'h1' // References a key inside "formattingRules"
                component: Button // the React component being used for rendering
                callbackPropName: 'onClick' // Name of the callback prop of the Component which is
                                               fired when the component's value changes.

                // all other properties are directly passed on to the component.
            }

        ## Component wiring

        - Each toolbar component receives all properties except "formatting" and "component" directly as props.
        - Furthermore, the "isActive" property is bound, which is a boolean flag defining whether the text style
          referenced by "formatting" is currently active or not.
        - Furthermore, the callback specified in "callbackPropName" is wired, which toggles the value.
    `));

    //
    // Configure richtext editing toolbar
    //

    /**
     * Basic Inline Styles (Bold, Italic, ...)
     */

    // Bold
    richtextToolbar.add('strong', {
        formattingRule: 'strong',
        component: IconButton,
        callbackPropName: 'onClick',

        icon: 'bold',
        hoverStyle: 'brand'
    });

    // Italic
    richtextToolbar.add('italic', {
        formattingRule: 'em',
        component: IconButton,
        callbackPropName: 'onClick',

        icon: 'italic',
        hoverStyle: 'brand'
    });

    // Underline
    richtextToolbar.add('underline', {
        formattingRule: 'u',
        component: IconButton,
        callbackPropName: 'onClick',

        icon: 'underline',
        hoverStyle: 'brand'
    });

    // Subscript
    richtextToolbar.add('subscript', {
        formattingRule: 'sub',
        component: IconButton,
        callbackPropName: 'onClick',

        icon: 'subscript',
        hoverStyle: 'brand'
    });

    // Superscript
    richtextToolbar.add('superscript', {
        formattingRule: 'sup',
        component: IconButton,
        callbackPropName: 'onClick',

        icon: 'superscript',
        hoverStyle: 'brand'
    });

    // Strike-Through
    richtextToolbar.add('strikethrough', {
        formattingRule: 'del',
        component: IconButton,
        callbackPropName: 'onClick',

        icon: 'strikethrough',
        hoverStyle: 'brand'
    });

    /**
     * Basic Paragraph Styles (p, h1, h2, pre, ...)
     */
    richtextToolbar.add('style', {
        component: StyleSelect,
        callbackPropName: 'onSelect',
        isVisibleWhen: () => true
    });

    // p tag
    richtextToolbar.add('style/p', {
        formattingRule: 'p',
        label: 'Paragraph'
    });

    // h1
    richtextToolbar.add('style/h1', {
        formattingRule: 'h1',
        label: 'Headline 1'
    });

    // h2
    richtextToolbar.add('style/h2', {
        formattingRule: 'h2',
        label: 'Headline 2'
    });

    // h3
    richtextToolbar.add('style/h3', {
        formattingRule: 'h3',
        label: 'Headline 3'
    });

    // h4
    richtextToolbar.add('style/h4', {
        formattingRule: 'h4',
        label: 'Headline 4'
    });

    // h5
    richtextToolbar.add('style/h5', {
        formattingRule: 'h5',
        label: 'Headline 5'
    });

    // h6
    richtextToolbar.add('style/h6', {
        formattingRule: 'h6',
        label: 'Headline 6'
    });

    // pre
    richtextToolbar.add('style/pre', {
        formattingRule: 'pre',
        label: 'Preformatted'
    });

    /**
     * Sorted and Unsorted Lists
     */

    // ordered list
    richtextToolbar.add('orderedList', {
        formattingRule: 'ol',
        component: IconButton,
        callbackPropName: 'onClick',

        icon: 'list-ol',
        hoverStyle: 'brand'
    });

    // unordered list
    richtextToolbar.add('unorderedList', {
        formattingRule: 'ul',
        component: IconButton,
        callbackPropName: 'onClick',

        icon: 'list-ul',
        hoverStyle: 'brand'
    });

    // Indent
    richtextToolbar.add('indent', {
        formattingRule: 'indent',
        component: IconButton,
        callbackPropName: 'onClick',

        icon: 'indent',
        hoverStyle: 'brand',
        isVisibleWhen: (enabledFormattingRuleIds, formattingUnderCursor) => {
            return (enabledFormattingRuleIds.indexOf('ul') !== -1 || enabledFormattingRuleIds.indexOf('ol') !== -1) &&
                formattingUnderCursor.indent !== richtextToolbar.TRISTATE_DISABLED;
        }
    });

    // Outdent
    richtextToolbar.add('outdent', {
        formattingRule: 'outdent',
        component: IconButton,
        callbackPropName: 'onClick',

        icon: 'outdent',
        hoverStyle: 'brand',
        isVisibleWhen: (enabledFormattingRuleIds, formattingUnderCursor) => {
            return (enabledFormattingRuleIds.indexOf('ul') !== -1 || enabledFormattingRuleIds.indexOf('ol') !== -1) &&
                formattingUnderCursor.outdent !== richtextToolbar.TRISTATE_DISABLED;
        }
    });

    /**
     * Tables
     */
    richtextToolbar.add('table', {
        formattingRule: 'table',
        component: IconButton,
        callbackPropName: 'onClick',

        icon: 'table',
        hoverStyle: 'brand'
    });

    /**
     * Remove formatting
     */
    richtextToolbar.add('removeFormat', {
        formattingRule: 'removeFormat',
        component: IconButton,
        callbackPropName: 'onClick',

        icon: 'table',
        hoverStyle: 'brand'
    });

    //
    // Create server feedback handlers registry
    //

    const serverFeedbackHandlers = globalRegistry.add('serverFeedbackHandlers', new SynchronousRegistry(`
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
