import React from 'react';
import {getReferencesSummary} from './infrastructure/http';
import {usePromise} from '@neos-project/framework-promise-react';
import {selectors, actions, useSelector} from '@neos-project/neos-ui-redux-store';
import {ErrorView} from "@neos-project/neos-ui-error";
import {HoverActions} from "./presentation/HoverActions";
import {ReferencesItem} from "./presentation/ReferencesItem";
import {IEditor} from "./domain";
import {useDispatch} from 'react-redux';

export const createReferencesEditor = (editor: IEditor) => (props) => {
    const workspaceName = useSelector(selectors.CR.Workspaces.personalWorkspaceNameSelector);
    const dimension = useSelector(selectors.CR.ContentDimensions.active);
    const selectedNodeId = useSelector(selectors.CR.Nodes.focusedSelector);

    const dispatch = useDispatch();

    const fetch__referencesSummary = usePromise(async () => {
        if (!workspaceName || !dimension || !selectedNodeId?.identifier) {
            console.warn('Missing workspaceName, dimension or selectedNodeId');
            return null;
        }

        const result = await getReferencesSummary(
            workspaceName,
            dimension,
            selectedNodeId.identifier,
            // todo does not work with empty
            props.value,
            props.identifier
        );

        if ('success' in result) {
            return result.success;
        }

        if ('error' in result) {
            throw result.error;
        }

        return null;
    }, []);

    const onEdit = React.useCallback(async () => {
        if (!fetch__referencesSummary.value) {
            return;
        }

        const result = await editor.transactions.editLink(
            props.value,
            // todo flatten structure no references[0]?.!!!!!!!!
            fetch__referencesSummary.value.references[0]?.constraints ?? {},
            fetch__referencesSummary.value.references[0]?.propertySchema ?? {},
        );

        if (result.change) {
            // todo only for testing
            dispatch(actions.UI.Inspector.commitChange({
                type: 'Neos.Neos.Ui:Property',
                subject: selectedNodeId!.contextPath,
                payload: {
                   propertyName: 'lol',
                   value: 'test' + Math.random(),
               }
            }));
        }

    }, [editor, fetch__referencesSummary]);

    if (fetch__referencesSummary.isLoading) {
        return <div>Loading...</div>;
    }

    if (fetch__referencesSummary.error) {
        return <ErrorView error={fetch__referencesSummary.error} />;
    }

    return (
        <>
            {(fetch__referencesSummary.value?.references ?? []).map(reference => {
                return (
                    <HoverActions key={reference.uri} onEdit={onEdit} onDelete={() => {}}>
                        <ReferencesItem reference={reference} isDraggable={(fetch__referencesSummary.value?.references?.length ?? 0) > 1}/>
                    </HoverActions>
                );
            })}
        </>
    );
};
