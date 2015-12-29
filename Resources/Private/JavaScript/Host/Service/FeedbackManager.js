import {service} from '../../Shared/';
const {logger} = service;

class FeedbackManager {

    handleFeedback(feedbackEnvelope) {
        feedbackEnvelope.feedbacks.forEach(feedback => {
            const feedbackHandler = this.getFeedbackHandler(feedback.type);

            feedbackHandler(feedback, feedbackEnvelope);
        });
    }

    getFeedbackHandler(type) {
        // Fallback: just log the feedback
        return (feedback, envelope) => {
            logger.info('[' + envelope.timestamp + '] ' + feedback.description);
        };
    }

}

export default store => new FeedbackManager(store);
