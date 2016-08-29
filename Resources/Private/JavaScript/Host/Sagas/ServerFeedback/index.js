import {takeEvery} from 'redux-saga';
import {put, call} from 'redux-saga/effects';

import {actionTypes} from 'Host/Redux/index';
import registry from 'Host/Extensibility/Registry/index';

function * watchServerFeedback(store) {
    yield * takeEvery(actionTypes.ServerFeedback.HANDLE_SERVER_FEEDBACK, function * handleServerFeedback(action) {
        const {feedbackEnvelope} = action.payload;
        const {feedbacks} = feedbackEnvelope;

        feedbacks.forEach(feedback => {
            const feedbackHandler = registry.serverFeedbackHandlers.get(feedback.type);

            if (feedbackHandler) {
                feedbackHandler(feedback.payload, store);
            } else {
                console.warn(`Feedback Handler ${feedback.type} is not defined.`);
            }
        })
    });
}

export const sagas = [
    watchServerFeedback
];
