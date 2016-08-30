import uuid from 'uuid';
import {actions} from 'Host/Redux';

const {manifest} = window['@Neos:HostPluginAPI'];

import {configureInlineEditing} from './manifest.inlineEditing';

manifest('main', registry => {
    configureInlineEditing(registry);

    /**
     * Feedback Handlers
     */
    const flashMessageFeedbackHandler = (feedbackPayload, store) => {
        const {message, severity} = feedbackPayload;
        const timeout = severity.toLowerCase() === 'success' ? 5000 : 0;
        const id = uuid.v4();

        store.dispatch(actions.UI.FlashMessages.add(id, message, severity, timeout));
    };
    registry.serverFeedbackHandlers.add('Neos.Neos.Ui:Success', flashMessageFeedbackHandler);
    registry.serverFeedbackHandlers.add('Neos.Neos.Ui:Error', flashMessageFeedbackHandler);
    registry.serverFeedbackHandlers.add('Neos.Neos.Ui:Info', feedbackPayload => {
        switch (feedbackPayload.severity) {
            case 'ERROR':
                console.error(feedbackPayload.message);
                break;

            default:
                console.info(feedbackPayload.message);
                break;
        }
    });
    registry.serverFeedbackHandlers.add('Neos.Neos.Ui:UpdateWorkspaceInfo', (feedbackPayload, store) => {
        const {workspaceName, workspaceInfo} = feedbackPayload;
        store.dispatch(actions.CR.Workspaces.update(workspaceName, workspaceInfo));
    });
    registry.serverFeedbackHandlers.add('Neos.Neos.Ui:ReloadDocument', () => {
        [].slice.call(document.querySelectorAll(`iframe[name=neos-content-main]`)).forEach(iframe => {
            const iframeWindow = iframe.contentWindow || iframe;

            iframeWindow.location.href = iframeWindow.location.href;
        });
    });
});
