import {service} from 'Shared/index';
import backend from './Backend.js';
const {logger} = service;

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
        const {asyncComponents} = backend;
        const {feedbackHandlers} = asyncComponents;

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
