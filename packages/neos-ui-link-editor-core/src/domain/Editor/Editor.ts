import {ActionType, getType} from 'typesafe-actions';

import {ILink, ILinkOptions} from '../Link';

import * as actions from './EditorAction';
import {createChannel, createState, ReadonlyState} from "@neos-project/framework-observable";

export interface IEditorState {
    enabledLinkOptions: (keyof ILinkOptions)[]
    editorOptions: {
        linkTypes?: {
            [identifier: string]: {
                enabled?: boolean;
                position?: string;
            }
        }
    }
    isOpen: boolean
    initialValue:  null | ILink
}

type IEditorResult =
    | {change: true, value: null | ILink}
    | {change: false}
;

const initialState: IEditorState = {
    enabledLinkOptions: [],
    editorOptions: {},
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
        case getType(actions.ValueWasUnset):
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
    const unset = () => dispatch(actions.ValueWasUnset());
    const apply = (value: ILink) => dispatch(actions.ValueWasApplied(value));
    const editLink = (
        initialValue: null | ILink,
        enabledLinkOptions: (keyof ILinkOptions)[] = [],
        editorOptions: Record<string, unknown> = {}
    ) => new Promise<IEditorResult>(
        resolve => {
            dispatch(
                actions.EditorWasOpened(initialValue, enabledLinkOptions, editorOptions)
            );

            actions$.subscribe({
                next: action => {
                    switch (action.type) {
                        case getType(actions.EditorWasDismissed):
                            return resolve({change: false});
                        case getType(actions.ValueWasUnset):
                            return resolve({change: true, value: null});
                        case getType(actions.ValueWasApplied):
                            return resolve({change: true, value: action.payload});
                        default:
                            return;
                    }
            }});
        }
    );

    return Object.freeze({
        state$: state$ as ReadonlyState<IEditorState>,
        transactions: {dismiss, unset, apply, editLink}
    });
}

export type IEditor = ReturnType<typeof createEditor>;
