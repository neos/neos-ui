import React from 'react';
import {getReferencesSummary} from './infrastructure/http';
import {usePromise} from '@neos-project/framework-promise-react';
import {actions, selectors, useSelector} from '@neos-project/neos-ui-redux-store';
import {discardChannel$} from '@neos-project/neos-ui-sagas/src/UI/Inspector';
import {ErrorView} from '@neos-project/neos-ui-error';
import {HoverActions} from './presentation/HoverActions';
import {ReferencesItem} from './presentation/ReferencesItem';
import {IReferences} from './domain';
import {Button} from '@neos-project/react-ui-components';
import {useDispatch} from 'react-redux';
import {ActiveReferenceEditorDialog} from './application/ReferencesPropertiesDialog/ReferencesPropertiesDialog';
import {useLatestState} from '@neos-project/framework-observable-react';
import {createState} from '@neos-project/framework-observable';
import {Editor} from './domain/Editor/Editor';
import {Tree} from '../../neos-ui-references-editor-custom-node-tree';

export const createReferencesEditor = () => (props) => {
    const workspaceName = useSelector(selectors.CR.Workspaces.personalWorkspaceNameSelector);
    const dimension = useSelector(selectors.CR.ContentDimensions.active);
    const selectedNodeId = useSelector(selectors.CR.Nodes.focusedSelector);
    const dispatch = useDispatch();

    const editor$ = React.useMemo(() => createState(Editor.fromLoadingState(1)), []);

    React.useEffect(() => {
        const subscription = editor$.subscribe({next: (editor) => {
            const change = editor.getChange(selectedNodeId!.contextPath, props.identifier);
            if (change) {
                dispatch(actions.UI.Inspector.commitChange(change));
            }
        }});
        return subscription.unsubscribe;
    }, [editor$]);

    React.useEffect(() => {
        const subscription = discardChannel$.subscribe({next: () => {
            editor$.update(editor => editor.withDiscard())
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
            const references: IReferences = {};

            for (const reference of result.success.references) {
                const nodeId = reference.uri.substring('node://'.length); // todo hack
                references[nodeId] = {
                    targetNodeId: nodeId,
                    ...reference
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

    const onDelete = React.useCallback((referenceTargetId: string) => editor$.update(editor => editor.withRemovedReference(referenceTargetId)), [editor$]);

    if (editor.isLoading()) {
        return <div>Loading {editor.getLoadingReferencesCount()}...</div>;
    }

    if (fetch__referencesSummary.error) {
        return <ErrorView error={fetch__referencesSummary.error} />;
    }

    const openSecondaryEditor = () => {
        if (!dimension) {
            // TODO handle
            return;
        }
        props.renderSecondaryInspector('identifiersss', () =>
            <Tree
                workspaceName={workspaceName}
                dimensionValues={dimension}
                startingPoint={'/<Neos.Neos:Sites>/'}
                loadingDepth={4}
                baseNodeTypeFilter={''}
                onSelect={function (nodeId: string): void {
                    console.error('Function not implemented', nodeId);
                }} />)
    }

    return (
        <>
            {Object.values(editor.getReferences()).map(reference => {
                return (
                    <HoverActions key={reference.targetNodeId} onEdit={onEdit} onDelete={() => onDelete(reference.targetNodeId)}>
                        <ReferencesItem reference={reference} isDraggable={(fetch__referencesSummary.value?.references?.length ?? 0) > 1}/>
                    </HoverActions>
                );
            })}
            <Button onClick={openSecondaryEditor}>Neues Item</Button>
            {
                editor.isReferencePropertyEditingOpen() ? <ActiveReferenceEditorDialog editor$={editor$}/> : null
            }
        </>
    );
};
