import {ActionType, getType} from 'typesafe-actions';

import * as actions from './EditorAction';
import {createChannel, createState, ReadonlyState} from '@neos-project/framework-observable';
import {IReferences} from "../References";

export interface IEditorState {
    constraints: any,
    propertySchema: any,
    isOpen: boolean,
    initialValue: null | IReferences,
}

type IEditorResult =
    | {change: true, value: null | IReferences}
    | {change: false}
;

const initialState: IEditorState = {
    constraints: {},
    propertySchema: {},
    isOpen: false,
    initialValue: null
};

export function editorReducer(
    state: IEditorState = initialState,
    action: ActionType<typeof actions>
): IEditorState {
    switch (action.type) {
        case getType(actions.EditorWasOpened):
            return {
                ...action.payload,
                isOpen: true
            };
        case getType(actions.EditorWasDismissed):
        case getType(actions.ValueWasApplied):
            return initialState;
        default:
            return state;
    }
}

export function createEditor() {
    const actions$ = createChannel<ActionType<typeof actions>>();

    const dispatch = actions$.next;

    const state$ = createState(initialState);

    actions$.subscribe({
        next: (action) => state$.update(
            (current) => editorReducer(
                current,
                action
            )
        )
    })

    const dismiss = () => dispatch(actions.EditorWasDismissed());
    const apply = (value: IReferences) => dispatch(actions.ValueWasApplied(value));
    const editLink = (
        initialValue: null | IReferences,
        constraints: any,
        propertySchema: any,
    ) => new Promise<IEditorResult>(
        resolve => {
            dispatch(
                actions.EditorWasOpened(initialValue, constraints, propertySchema)
            );

            actions$.subscribe({
                next: action => {
                    switch (action.type) {
                        case getType(actions.EditorWasDismissed):
                            return resolve({change: false});
                        case getType(actions.ValueWasApplied):
                            return resolve({change: true, value: action.payload});
                        default:
                    }
                }
            });
        }
    );

    return Object.freeze({
        state$: state$ as ReadonlyState<IEditorState>,
        transactions: {dismiss, apply, editLink}
    });
}

export type IEditor = ReturnType<typeof createEditor>;
