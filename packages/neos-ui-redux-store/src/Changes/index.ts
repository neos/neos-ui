import {action as createAction, ActionType} from 'typesafe-actions';
import {Change} from '@neos-project/neos-ts-interfaces';

export enum actionTypes {
    PERSIST = '@neos/neos-ui/Transient/Changes/PERSIST'
}

//
// Export the actions
//
export const actions = {
    /**
     * Perists an array of changes.
     */
    persistChanges: (changes: ReadonlyArray<Change>) => createAction(actionTypes.PERSIST, {changes})
};

export type Action = ActionType<typeof actions>;

//
// Export the selectors
//
export const selectors = {};
