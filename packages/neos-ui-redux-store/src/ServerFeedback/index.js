import {createAction} from 'redux-actions';

import {handleActions} from '@neos-project/utils-redux';

const HANDLE_SERVER_FEEDBACK = '@neos/neos-ui/ServerFeedback/HANDLE_SERVER_FEEDBACK';

//
// Export the action types
//
export const actionTypes = {
    HANDLE_SERVER_FEEDBACK
};

/**
 * Handles server feedback, triggering reloads, updates, ... of the UI.
 *
 * feedbackEnvelope must be of the following form:
 *  {
 *      feedbacks: [
 *          {
 *              type: "feedback_type", // resolved in registry.serverFeedbackHandlers
 *              description: "Human-readable description",
 *              payload: {
 *                  // type-specific payload.
 *              }
 *          }
 *      ]
 *  }
 */
const handleServerFeedback = createAction(HANDLE_SERVER_FEEDBACK, feedbackEnvelope => ({feedbackEnvelope}));

//
// Export the actions
//
export const actions = {
    handleServerFeedback
};

//
// Export the reducer
//
export const reducer = handleActions({
    // HANDLE_SERVER_FEEDBACK has no reducer, this is done by the ServerFeedback Saga.
});

//
// Export the selectors
//
export const selectors = {};
