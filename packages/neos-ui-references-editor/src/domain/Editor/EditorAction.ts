import {createAction} from 'typesafe-actions';

import {IReferences} from '../References';

export const EditorWasOpened = createAction(
    '@neos/neos-ui/ReferencesEditor/EditorWasOpened',
    (
        initialValue: null | IReferences,
        constraints: any,
        schema: any,
    ) => ({initialValue, constraints, schema})
)();

export const EditorWasDismissed = createAction(
    '@neos/neos-ui/ReferencesEditor/EditorWasDismissed'
)();

export const ValueWasApplied = createAction(
    '@neos/neos-ui/ReferencesEditor/ValueWasApplied',
    (value: IReferences) => value
)();
