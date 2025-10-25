import React from 'react';
import {Tree} from '../../../../neos-ui-references-editor-custom-node-tree'
import {Editor} from '../../domain/Editor/Editor';
import {State} from '@neos-project/framework-observable';
import {getNodeSummary} from "../../infrastructure/http/getNodeSummary";
import {useLatestState} from "@neos-project/framework-observable-react";

interface ReferencesTreeSecondaryEditorProps {
    workspaceName: string;
    dimensionValues: any;
    startingPoint: string;
    editor$: State<Editor>
}

export const ReferencesTreeSecondaryEditor = (props: ReferencesTreeSecondaryEditorProps) => {
    const {workspaceName, dimensionValues, startingPoint, editor$} = props;

    const onSelectTreeNode = async (nodeId: string) => {
        if (editor$.current.getSelectedNodeIds().includes(nodeId)) {
            // already selected
            return;
        }
        editor$.update(editor => editor.withSelectedTargetNodeId(nodeId));
        const result = await getNodeSummary({nodeId, dimensionValues, workspaceName})

        if ('success' in result) {
            editor$.update(editor => editor.withAddedReferencePresentation(nodeId, result.success));
        } else {
            // todo handle error
        }
    }

    const editor = useLatestState(editor$);

    return (
        <Tree
            workspaceName={workspaceName}
            dimensionValues={dimensionValues}
            startingPoint={startingPoint}
            // todo options configurable
            loadingDepth={4}
            baseNodeTypeFilter={''}
            selectedTreeNodeIds={editor.getSelectedNodeIds()}
            onSelect={onSelectTreeNode}
        />
    )
}

