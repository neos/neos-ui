import * as React from 'react';

import {Button, Dialog} from '@neos-project/react-ui-components';

import {ErrorBoundary, ErrorView} from '@neos-project/neos-ui-error';

import {IEditor, IReferences,} from '../../domain';
import EditorEnvelope from '@neos-project/neos-ui-editors/src/EditorEnvelope/index';

import {useLatestState} from '@neos-project/framework-observable-react';
import {useSelector} from '@neos-project/neos-ui-redux-store';
import {translate} from '@neos-project/neos-ui-i18n';
import {createState} from "@neos-project/framework-observable";

export type TransientState = {
}

export const createDialog = (editor: IEditor) => () => {
    const {isOpen} = useLatestState(editor.state$);

    if (isOpen) {
        return <ActiveReferenceEditorDialog editor={editor}/>;
    }

    return null;
};

const ActiveReferenceEditorDialog: React.FC<{
    editor: IEditor
}> = ({editor}) => {

    // todo use constraints
    // todo lol initialValue is never null?
    const {initialValue, constraints, propertySchema} = useLatestState(editor.state$);

    const {dismiss, apply} = editor.transactions;

    const form$ = React.useMemo(() => createState({
        references: initialValue ?? [],
        selectedReferenceId: Object.keys(initialValue!)[0]
    }), [initialValue]);

    const form = useLatestState(form$);

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
                    onClick={() => apply(form$.current.references)}
                >
                    {translate('Neos.Neos.Ui:LinkEditor.Main:dialog.action.apply', '')}
                </Button>
            ]}
        >
            <ErrorBoundary errorFallback={ErrorView}>

                edit {form.selectedReferenceId}

                {Object.entries(propertySchema).map(([propertyName, propertyConfiguration]) =>
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
