import React from 'react';
import {Tree} from '../../../../neos-ui-references-editor-custom-node-tree'
import {Editor} from '../../domain/Editor/Editor';
import {State} from '@neos-project/framework-observable';

interface ReferencesTreeSecondaryEditorProps {
    workspaceName: string;
    dimensionValues: any;
    startingPoint: string;
    editor$: State<Editor>
}

export const ReferencesTreeSecondaryEditor = (props: ReferencesTreeSecondaryEditorProps) => {
    const {workspaceName, dimensionValues, startingPoint, editor$} = props;
    const [selectedTreeNodeIds, setSelectedTreeNodeIds] = React.useState<string[]>([]);

    const onSelectTreeNode = async (nodeId: string) => {
        console.log('select', nodeId);
        // optimistic selection to show select state in tree
        setSelectedTreeNodeIds(array => [...array, nodeId])
        // TODO test values
        const referenceValue = {
            targetNodeId: nodeId,
            'icon': 'header',
            'label': "Node " + nodeId,
            'uri': 'node://d17caff2-f50c-d30b-b735-9b9216de02e9',
            'breadcrumbs': [
                {
                    'icon': 'globe',
                    'label': 'Home'
                },
                {
                    'icon': 'far fa-folder-open',
                    'label': 'Teaser area (teaser)'
                },
                {
                    'icon': 'header',
                    'label': 'Welcome to the Neos CMS demo'
                }
            ],
            'properties': null
        };
        // mock api call for now
        setTimeout(() => {
            editor$.update(editor => editor.withAddedReference(referenceValue));
        }, 2000);
    }

    React.useEffect(() => {
        const subscription = editor$.subscribe({
            next: (editor) =>
                setSelectedTreeNodeIds(Object.keys(editor.getReferences()))
        });
        return subscription.unsubscribe;
    }, [editor$]);

    return (
        <Tree
            workspaceName={workspaceName}
            dimensionValues={dimensionValues}
            startingPoint={startingPoint}
            loadingDepth={4}
            baseNodeTypeFilter={''}
            selectedTreeNodeIds={selectedTreeNodeIds}
            onSelect={onSelectTreeNode}
        />
    )
}

