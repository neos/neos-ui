import {takeEvery} from 'redux-saga/effects';

import {actionTypes} from '@neos-project/neos-ui-redux-store';

export function * watchServerFeedback({store, globalRegistry}) {
    const serverFeedbackHandlers = globalRegistry.get('serverFeedbackHandlers');

    yield takeEvery(actionTypes.ServerFeedback.HANDLE_SERVER_FEEDBACK, action => {
        const {feedbackEnvelope} = action.payload;
        const {feedbacks} = feedbackEnvelope;

        feedbacks.forEach(feedback => {
            const feedbackHandlers = serverFeedbackHandlers.getChildren(feedback.type);
            feedbackHandlers.forEach(feedbackHandler => {
                if (feedbackHandler) {
                    feedbackHandler(feedback.payload, {store, globalRegistry, allFeedbacksFromThisRequest: feedbacks});
                } else {
                    console.warn(`No Feedback Handlers defined for ${feedback.type}.`);
                }
            });
        });
    });
}
