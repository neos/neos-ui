import produce from 'immer';
import {action as createAction, ActionType} from 'typesafe-actions';
import {$get} from 'plow-js';

import {actionTypes as system, InitAction} from '@neos-project/neos-ui-redux-store/src/System';

import * as selectors from './selectors';

// Not moving it to @neos-project/neos-ts-interfaces yet, as it's rather an implementation detail
export interface Formatting {
    [propName: string]: boolean;
}

export interface State extends Readonly<{
    src: string | null;
    previewUrl: string | null;
    formattingUnderCursor: Formatting;
    currentlyEditedPropertyName: string | null;
    isLoading: boolean;
    focusedProperty: string | null;
    backgroundColor: string;
    shouldScrollIntoView: boolean;
}> {}

export const defaultState: State = {
    src: null,
    previewUrl: null,
    formattingUnderCursor: {},
    currentlyEditedPropertyName: null,
    isLoading: true,
    focusedProperty: null,
    backgroundColor: '#ffffff',
    shouldScrollIntoView: false
};

//
// Export the action types
//
export enum actionTypes {
    SET_PREVIEW_URL = '@neos/neos-ui/UI/ContentCanvas/SET_PREVIEW_URL',
    SET_SRC = '@neos/neos-ui/UI/ContentCanvas/SET_SRC',
    FORMATTING_UNDER_CURSOR = '@neos/neos-ui/UI/ContentCanvas/FORMATTING_UNDER_CURSOR',
    SET_CURRENTLY_EDITED_PROPERTY_NAME = '@neos/neos-ui/UI/ContentCanvas/SET_CURRENTLY_EDITED_PROPERTY_NAME',
    START_LOADING = '@neos/neos-ui/UI/ContentCanvas/START_LOADING',
    STOP_LOADING = '@neos/neos-ui/UI/ContentCanvas/STOP_LOADING',
    RELOAD = '@neos/neos-ui/UI/ContentCanvas/RELOAD',
    FOCUS_PROPERTY = '@neos/neos-ui/UI/ContentCanvas/FOCUS_PROPERTY',
    REQUEST_SCROLL_INTO_VIEW = '@neos/neos-ui/UI/ContentCanvas/REQUEST_SCROLL_INTO_VIEW',
    REQUEST_REGAIN_CONTROL = '@neos/neos-ui/UI/ContentCanvas/REQUEST_REGAIN_CONTROL',
    REQUEST_LOGIN = '@neos/neos-ui/UI/ContentCanvas/REQUEST_LOGIN'
}

const setPreviewUrl = (previewUrl: string) =>  createAction(actionTypes.SET_PREVIEW_URL, previewUrl);
const setSrc = (src: string, metaKeyPressed: boolean = false) =>  createAction(actionTypes.SET_SRC, {src, metaKeyPressed});
const setFormattingUnderCursor = (formatting: Formatting) => createAction(actionTypes.FORMATTING_UNDER_CURSOR, formatting);
const setCurrentlyEditedPropertyName = (propertyName: string) => createAction(actionTypes.SET_CURRENTLY_EDITED_PROPERTY_NAME, propertyName);
const startLoading = () => createAction(actionTypes.START_LOADING);
const stopLoading = () => createAction(actionTypes.STOP_LOADING);
const reload = (uri: string) => createAction(actionTypes.RELOAD, {uri});
// Set a flag to tell ContentCanvas to scroll the focused node into view
const requestScrollIntoView = (activate: boolean) => createAction(actionTypes.REQUEST_SCROLL_INTO_VIEW, activate);
// If we have lost controll over the iframe, we need to take action
const requestRegainControl = (src: string, errorMessage: string) => createAction(actionTypes.REQUEST_REGAIN_CONTROL, {src, errorMessage});
const requestLogin = () => createAction(actionTypes.REQUEST_LOGIN);

//
// Export the actions
//
export const actions = {
    setPreviewUrl,
    setSrc,
    setFormattingUnderCursor,
    setCurrentlyEditedPropertyName,
    startLoading,
    stopLoading,
    reload,
    requestScrollIntoView,
    requestRegainControl,
    requestLogin
};

export type Action = ActionType<typeof actions>;

//
// Export the reducer
//
export const reducer = (state: State = defaultState, action: InitAction | Action) => produce(state, draft => {
    switch (action.type) {
        case system.INIT: {
            draft.backgroundColor = $get(['payload', 'ui', 'contentCanvas', 'backgroundColor'], action);
            draft.src = $get(['payload', 'ui', 'contentCanvas', 'src'], action) || null;
            break;
        }
        case actionTypes.SET_PREVIEW_URL: {
            draft.previewUrl = action.payload;
            break;
        }
        case actionTypes.SET_SRC: {
            draft.src = action.payload.src;
            break;
        }
        case actionTypes.FORMATTING_UNDER_CURSOR: {
            draft.formattingUnderCursor = action.payload;
            break;
        }
        case actionTypes.SET_CURRENTLY_EDITED_PROPERTY_NAME: {
            draft.currentlyEditedPropertyName = action.payload;
            break;
        }
        case actionTypes.STOP_LOADING: {
            draft.isLoading = false;
            break;
        }
        case actionTypes.START_LOADING: {
            draft.isLoading = true;
            break;
        }
        case actionTypes.REQUEST_SCROLL_INTO_VIEW: {
            draft.shouldScrollIntoView = action.payload;
            break;
        }
        case actionTypes.REQUEST_REGAIN_CONTROL: {
            draft.src = '';
            break;
        }
    }
});

//
// Export the selectors
//
export {selectors};
