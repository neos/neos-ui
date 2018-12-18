import produce from 'immer';
import {action as createAction, ActionType} from 'typesafe-actions';
import {$get, $set} from 'plow-js';

import {InitAction, GlobalState} from '@neos-project/neos-ui-redux-store/src/System';
import {Node, NodeContextPath} from '@neos-project/neos-ts-interfaces';

import * as selectors from '@neos-project/neos-ui-redux-store/src/UI/Inspector/selectors';
export interface State extends Readonly<{
    shouldPromptToHandleUnappliedChanges: boolean;
    secondaryInspectorIsOpen: boolean;
    valuesByNodePath: {
        [propTypes: string]: {
            [propTypes: string]: any | undefined;
        } | undefined;
    };
}> {}

export const defaultState: State = {
    shouldPromptToHandleUnappliedChanges: false,
    secondaryInspectorIsOpen: false,
    valuesByNodePath: {}
};


//
// Export the action types
//

export enum actionTypes {
    //
    // System actions
    //
    COMMIT = '@neos/neos-ui/UI/Inspector/COMMIT',
    CLEAR = '@neos/neos-ui/UI/Inspector/CLEAR',

    //
    // User actions, which are handled by a saga
    //
    APPLY = '@neos/neos-ui/UI/Inspector/APPLY',
    DISCARD = '@neos/neos-ui/UI/Inspector/DISCARD',
    ESCAPE = '@neos/neos-ui/UI/Inspector/ESCAPE',
    RESUME = '@neos/neos-ui/UI/Inspector/RESUME',

    //
    // Actions to control the secondary inspector window
    //
    SECONDARY_OPEN = '@neos/neos-ui/UI/Inspector/SECONDARY_OPEN',
    SECONDARY_CLOSE = '@neos/neos-ui/UI/Inspector/SECONDARY_CLOSE',
    SECONDARY_TOGGLE = '@neos/neos-ui/UI/Inspector/SECONDARY_TOGGLE'
}

type Hook = (value: any, options: []) => any;
interface HookMap extends Readonly<{
    [propName: string]: Hook | undefined;
}> {}
const commit = (propertyId: string, value: any, hooks: HookMap = {}, focusedNode: Node) => createAction(actionTypes.COMMIT, {propertyId, value, hooks, focusedNode});
const clear = (focusedNodeContextPath: NodeContextPath) => createAction(actionTypes.CLEAR, {focusedNodeContextPath});

const apply = () => createAction(actionTypes.APPLY);
const discard = (focusedNodeContextPath: NodeContextPath) => createAction(actionTypes.DISCARD, {focusedNodeContextPath});
const escape = () => createAction(actionTypes.ESCAPE);
const resume = () => createAction(actionTypes.RESUME);

const openSecondaryInspector = () => createAction(actionTypes.SECONDARY_OPEN);
const closeSecondaryInspector = () => createAction(actionTypes.SECONDARY_CLOSE);
const toggleSecondaryInspector = () => createAction(actionTypes.SECONDARY_TOGGLE);

//
// Export the actions
//
export const actions = {
    commit,
    clear,
    apply,
    discard,
    escape,
    resume,
    openSecondaryInspector,
    closeSecondaryInspector,
    toggleSecondaryInspector
};

export type Action = ActionType<typeof actions>;

//
// Export the reducer
//
export const subReducer = (state: State = defaultState, action: InitAction | Action) => produce(state, draft => {
    switch (action.type) {
        case actionTypes.COMMIT: {
            const {focusedNode, propertyId, value, hooks} = action.payload;
            const focusedNodePath = focusedNode.contextPath;
            const currentPropertyValue = $get(['properties', propertyId], focusedNode);
            const transientValueDiffers = (value !== null) && (value !== currentPropertyValue);
            if (typeof draft.valuesByNodePath[focusedNodePath] !== 'object') {
                draft.valuesByNodePath[focusedNodePath] = {};
            }
            const focusedValues = draft.valuesByNodePath[focusedNodePath];
            if (focusedValues) { // dummy type guard
                if (transientValueDiffers) {
                    focusedValues[propertyId] = hooks ? {value, hooks} : {value};
                } else {
                    delete focusedValues[propertyId];
                }
            }
            break;
        }
        case actionTypes.DISCARD: {
            draft.shouldPromptToHandleUnappliedChanges = false;
            delete draft.valuesByNodePath[action.payload.focusedNodeContextPath];
            break;
        }
        case actionTypes.CLEAR: {
            draft.shouldPromptToHandleUnappliedChanges = false;
            delete draft.valuesByNodePath[action.payload.focusedNodeContextPath];
            break;
        }
        case actionTypes.ESCAPE: {
            draft.shouldPromptToHandleUnappliedChanges = true;
            break;
        }
        case actionTypes.RESUME: {
            draft.shouldPromptToHandleUnappliedChanges = false;
            break;
        }
        case actionTypes.SECONDARY_OPEN: {
            draft.secondaryInspectorIsOpen = true;
            break;
        }
        case actionTypes.SECONDARY_CLOSE: {
            draft.secondaryInspectorIsOpen = false;
            break;
        }
        case actionTypes.SECONDARY_TOGGLE: {
            draft.secondaryInspectorIsOpen = !draft.secondaryInspectorIsOpen;
            break;
        }
    }
});

export const reducer = (globalState: GlobalState, action: InitAction | Action) => {
    // TODO: substitute global state with State when conversion of all UI reducers is done
    const state = $get(['ui', 'inspector'], globalState) || undefined;
    const newState = subReducer(state, action);
    return $set(['ui', 'inspector'], newState, globalState);
};

//
// Export the selectors
//

export {selectors};
