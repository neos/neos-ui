import React from 'react';
import {getReferencesSummary} from './infrastructure/http';
import {usePromise} from '@neos-project/framework-promise-react';
import {actions, selectors, useSelector} from '@neos-project/neos-ui-redux-store';
import {ErrorView} from "@neos-project/neos-ui-error";
import {HoverActions} from "./presentation/HoverActions";
import {ReferencesItem} from "./presentation/ReferencesItem";
import {IReferences} from "./domain";
import {useDispatch} from 'react-redux';
import {ActiveReferenceEditorDialog} from "./application/ReferencesPropertiesDialog/ReferencesPropertiesDialog";
import {useLatestState} from "@neos-project/framework-observable-react";
import {createState} from "@neos-project/framework-observable";
import {Editor} from "./domain/Editor/Editor";

export const createReferencesEditor = () => (props) => {
    const workspaceName = useSelector(selectors.CR.Workspaces.personalWorkspaceNameSelector);
    const dimension = useSelector(selectors.CR.ContentDimensions.active);
    const selectedNodeId = useSelector(selectors.CR.Nodes.focusedSelector);
    const dispatch = useDispatch();

    const editor$ = React.useMemo(() => createState(Editor.fromLoadingState(1)), [selectedNodeId, props.identifier]);

    React.useEffect(() => {
        const subscription = editor$.subscribe({ next: (editor) => {
            const change = editor.getChange(selectedNodeId!.contextPath);
            if (change) {
                dispatch(actions.UI.Inspector.commitChange(change));
            }
        }});
        return subscription.unsubscribe;
    }, [editor$]);

    const editor = useLatestState(editor$);

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
            let references: IReferences = {};

            for (const reference of result.success.references) {
                const nodeId = reference.uri.substring('node://'.length); // todo hack
                references[nodeId] = {
                    targetNodeId: nodeId,
                    properties: reference.properties
                }
            }

            editor$.update(editor => editor.withReferencesAndConfiguration(
                references,
                result.success.constraints ?? {},
                result.success.propertySchema ?? {},
            ))

            return result.success;
        }

        if ('error' in result) {
            throw result.error;
        }

        return null;
    }, []);

    // todo props.value, should be size of references to fake initial height.

    const onEdit = React.useCallback(() => editor$.update(editor => editor.withReferencePropertyEditing()), [editor$]);

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
            {
                editor.isReferencePropertyEditingOpen() ? <ActiveReferenceEditorDialog editor$={editor$}/> : null
            }
        </>
    );
};
