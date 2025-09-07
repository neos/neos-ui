import {createAction} from 'typesafe-actions';

import {ILink, ILinkOptions} from '../Link';

export const EditorWasOpened = createAction(
    '@neos/neos-ui/LinkEditor/EditorWasOpened',
    (
        initialValue: null | ILink,
        enabledLinkOptions: (keyof ILinkOptions)[],
        editorOptions: Record<string, unknown> = {}
    ) => ({initialValue, enabledLinkOptions, editorOptions})
)();

export const EditorWasDismissed = createAction(
    '@neos/neos-ui/LinkEditor/EditorWasDismissed'
)();

export const ValueWasUnset = createAction(
    '@neos/neos-ui/LinkEditor/ValueWasUnset'
)();

export const ValueWasApplied = createAction(
    '@neos/neos-ui/LinkEditor/ValueWasApplied',
    (value: ILink) => value
)();
