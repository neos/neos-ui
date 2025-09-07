import * as React from 'react';
import {ActionType, getType} from 'typesafe-actions';
import {BehaviorSubject, Subject} from 'rxjs';
import {scan, shareReplay} from 'rxjs/operators';

import {ILink, ILinkOptions} from '../Link';

import * as actions from './EditorAction';

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
    const actions$ = new Subject<ActionType<typeof actions>>();
    const dispatch = (action: ActionType<typeof actions>) => actions$.next(action);
    const state$ = new BehaviorSubject(initialState);

    actions$.pipe(
        scan(editorReducer, initialState),
        shareReplay(1)
    ).subscribe(state$);

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

            actions$.subscribe(action => {
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
            });
        }
    );

    return {
        state$,
        tx: {dismiss, unset, apply, editLink},
        initialState
    };
}

export type IEditor = ReturnType<typeof createEditor>;

export const EditorContext = React.createContext(createEditor());

export function useEditorState() {
    const {state$} = React.useContext(EditorContext);
    const [state, setState] = React.useState(state$.getValue());

    React.useEffect(() => {
        const subscription = state$.subscribe(setState);
        return () => subscription.unsubscribe();
    }, [state$]);

    return state;
}

export function useEditorTransactions() {
    const {tx} = React.useContext(EditorContext);
    return tx;
}
