import * as React from 'react';

import {Button, Dialog} from '@neos-project/react-ui-components';

import {ErrorBoundary, ErrorView} from '@neos-project/neos-ui-error';

import EditorEnvelope from '@neos-project/neos-ui-editors/src/EditorEnvelope/index';

import {useLatestState} from '@neos-project/framework-observable-react';
import {useSelector} from '@neos-project/neos-ui-redux-store';
import {translate} from '@neos-project/neos-ui-i18n';
import {State} from "@neos-project/framework-observable";
import {Editor} from "../../domain/Editor/Editor";

export const ActiveReferenceEditorDialog: React.FC<{
    editor$: State<Editor>
}> = ({editor$}) => {

    // todo use constraints
    // todo lol initialValue is never null?
    const editor = useLatestState(editor$);

    // const form$ = React.useMemo(() => createState({
    //     references: initialValue ?? [],
    //     selectedReferenceId: Object.keys(initialValue!)[0]
    // }), [initialValue]);
    // const form = useLatestState(form$);

    const dismiss = React.useCallback(() => editor$.update(editor => editor.withDismissedReferencePropertyEditing()), [editor$]);
    const apply = React.useCallback(() => editor$.update(editor => editor.withAppliedReferencePropertyEditing()), [editor$]);

    const isAuthenticated = useSelector(state => !state.system?.authenticationTimeout);

    if (!isAuthenticated) {
        return null;
    }

    return (
        <Dialog
            id="neos-ReferencesEditor"
            isOpen={true}
            preventClosing={false}
            onRequestClose={dismiss}
            title={<div>{translate('Neos.Neos.Ui:LinkEditor.Main:dialog.title', '')}</div>}
            style="wide"
            autoFocus={true}
            actions={[
                <Button onClick={dismiss}>
                    {translate('Neos.Neos.Ui:LinkEditor.Main:dialog.action.cancel', '')}
                </Button>,
                <Button
                    style="success"
                    type="submit"
                    disabled={false}
                    onClick={apply}
                >
                    {translate('Neos.Neos.Ui:LinkEditor.Main:dialog.action.apply', '')}
                </Button>
            ]}
        >
            <ErrorBoundary errorFallback={ErrorView}>

                {Object.entries({}).map(([propertyName, propertyConfiguration]) =>
                    <div key={propertyName} className={''}>
                        <EditorEnvelope
                            identifier={`${propertyName}--reference-dialog`}
                            label={propertyConfiguration?.ui?.label}
                            editor={propertyConfiguration?.ui?.editor}
                            helpMessage={propertyConfiguration?.ui?.help?.message || ''}
                            helpThumbnail={propertyConfiguration?.ui?.help?.thumbnail || ''}
                            options={propertyConfiguration?.ui?.editorOptions}
                            commit={(value) => form$.update(form => ({...form, references: {...form.references, [form.selectedReferenceId]: {
                                ...form.references[form.selectedReferenceId],
                                properties: {
                                    ...form.references[form.selectedReferenceId]?.properties,
                                    [propertyName]: value
                                }
                            }}}))}
                            validationErrors={[]}
                            value={form.references[form.selectedReferenceId]?.properties?.[propertyName] ?? ''}
                        />
                    </div>
                )}
            </ErrorBoundary>
        </Dialog>
    )
}
