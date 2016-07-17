import {service} from 'Shared/index';
const {logger} = service;
import registry from '@reduct/registry';

import * as feedbackHandler from './FeedbackHandler/index';

const feedbackHandlers = registry();
// Register FeedbackHandlers
feedbackHandlers.registerAll({
    'Neos.Neos.Ui:Success': feedbackHandler.flashMessage,
    'Neos.Neos.Ui:Error': feedbackHandler.flashMessage,
    'Neos.Neos.Ui:Info': feedbackHandler.logToConsole,
    'Neos.Neos.Ui:UpdateWorkspaceInfo': feedbackHandler.updateWorkspaceInfo,
    'Neos.Neos.Ui:ReloadDocument': feedbackHandler.reloadDocument
});

// TODO: looks as if this code is obsolete by now, as feedbackHandlers is nowhere to be found
class FeedbackManager {
    constructor(store) {
        this.store = store;
    }

    handleFeedback(feedbackEnvelope) {
        feedbackEnvelope.feedbacks.forEach(feedback => {
            const feedbackHandler = this.getFeedbackHandler(feedback.type);

            feedbackHandler(feedback, feedbackEnvelope, this.store);
        });
    }

    getFeedbackHandler(type) {
        try {
            return feedbackHandlers.get(type);
        } catch (err) {
            console.error(err);
        }

        // Fallback: just log the feedback
        return (feedback, envelope) => {
            logger.info(`[${envelope.timestamp}] ${feedback.description}`);
        };
    }

}

export default store => new FeedbackManager(store);
