import {takeEvery} from 'redux-saga';

import {actionTypes} from '@neos-project/neos-ui-redux-store';

function * watchServerFeedback({store, globalRegistry}) {
    const serverFeedbackHandlers = globalRegistry.get('serverFeedbackHandlers');

    yield * takeEvery(actionTypes.ServerFeedback.HANDLE_SERVER_FEEDBACK, action => {
        const {feedbackEnvelope} = action.payload;
        const {feedbacks} = feedbackEnvelope;

        feedbacks.forEach(feedback => {
            const feedbackHandler = serverFeedbackHandlers.get(feedback.type);

            if (feedbackHandler) {
                feedbackHandler(feedback.payload, {store, globalRegistry});
            } else {
                console.warn(`Feedback Handler ${feedback.type} is not defined.`);
            }
        });
    });
}

export const sagas = [
    watchServerFeedback
];
