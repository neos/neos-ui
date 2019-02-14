import {action as createAction, ActionType} from 'typesafe-actions';

// import {handleActions} from '@neos-project/utils-redux';


//
// Export the action types
//
export enum actionTypes {
    HANDLE_SERVER_FEEDBACK = '@neos/neos-ui/ServerFeedback/HANDLE_SERVER_FEEDBACK'
}

export interface Feedback extends Readonly<{
    type: string;
    description: string;
    payload: {};
}> {}

export interface FeedbackEnvelope extends Readonly<{
    feedbacks: Feedback[];
}> {}

//
// Export the actions
//
export const actions = {
    /**
     * Handles server feedback, triggering reloads, updates, ... of the UI.
     */
    handleServerFeedback: (feedbackEnvelope: FeedbackEnvelope) => createAction(actionTypes.HANDLE_SERVER_FEEDBACK, {feedbackEnvelope})
};

export type Action = ActionType<typeof actions>;

//
// Export the selectors
//
export const selectors = {};
