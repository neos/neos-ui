import * as React from 'react';

import {Button, Dialog} from '@neos-project/react-ui-components';

import {ErrorBoundary, ErrorView} from '@neos-project/neos-ui-error';

import {IEditor, IReferences,} from '../../domain';

import {useLatestState} from '@neos-project/framework-observable-react';
import {useSelector} from '@neos-project/neos-ui-redux-store';
import {translate} from '@neos-project/neos-ui-i18n';

export type TransientState = {
}

export const createDialog = (editor: IEditor) => () => {
    const {isOpen, initialValue} = useLatestState(editor.state$);

    if (isOpen) {
        return <ActiveReferenceEditorDialog editor={editor} initialValue={initialValue}/>;
    }

    return null;
};

const ActiveReferenceEditorDialog: React.FC<{
    editor: IEditor
    initialValue: IReferences | null
}> = ({editor, initialValue}) => {
    const {dismiss, apply} = editor.transactions;

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
                    onClick={() => apply([])}
                >
                    {translate('Neos.Neos.Ui:LinkEditor.Main:dialog.action.apply', '')}
                </Button>
            ]}
        >
            <ErrorBoundary errorFallback={ErrorView}>

                Huhu {JSON.stringify(initialValue)}

            </ErrorBoundary>
        </Dialog>
    )
}
