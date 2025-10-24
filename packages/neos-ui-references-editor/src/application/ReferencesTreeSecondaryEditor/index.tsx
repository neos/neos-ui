import React from 'react';
import {Tree} from '../../../../neos-ui-references-editor-custom-node-tree'
import {Editor} from '../../domain/Editor/Editor';
import {State} from '@neos-project/framework-observable';
import {useLatestState} from '@neos-project/framework-observable-react';

interface ReferencesTreeSecondaryEditorProps {
    workspaceName: string;
    dimensionValues: any;
    startingPoint: string;
    editor$: State<Editor>
}

export const ReferencesTreeSecondaryEditor = (props: ReferencesTreeSecondaryEditorProps) => {
    const {workspaceName, dimensionValues, startingPoint, editor$} = props;
    const editor = useLatestState(editor$);

    const onSelectTreeNode = (nodeId: string) => {
        console.log('select', nodeId);
    }

    return (
        <Tree
            workspaceName={workspaceName}
            dimensionValues={dimensionValues}
            startingPoint={startingPoint}
            loadingDepth={4}
            baseNodeTypeFilter={''}
            selectedTreeNodeIds={Object.keys(editor.getReferences())}
            onSelect={onSelectTreeNode}
        />
    )
}

