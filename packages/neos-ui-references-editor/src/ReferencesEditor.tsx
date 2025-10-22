import React from 'react';
import {ReferencesList} from './presentation/ReferencesList';
import {getReferencesSummary} from './infrastructure/http';
import {usePromise} from '@neos-project/framework-promise-react';
import {selectors, useSelector} from '@neos-project/neos-ui-redux-store';

const ReferencesEditor = (props) => {
    // TODO: props.renderSecondaryInspector ist das was gesucht ist
    console.log(props);
    const workspaceName = useSelector(selectors.CR.Workspaces.personalWorkspaceNameSelector);
    const dimension = useSelector(selectors.CR.ContentDimensions.active);
    const selectedNodeId = useSelector(selectors.CR.Nodes.focusedSelector);

    const fetch__referencesSummary = usePromise(async () => {
        if (!workspaceName || !dimension || !selectedNodeId?.identifier) {
            console.warn('Missing workspaceName, dimension or selectedNodeId');
            return null;
        }

        const result = await getReferencesSummary(
            workspaceName,
            dimension,
            selectedNodeId.identifier,
            // TODO: Wie komme ich an die Property ran? (blogs)
            selectedNodeId.properties.blogs,
            'blogs'
        );

        if ('success' in result) {
            return result.success;
        }

        return null;
    }, []);

    if (fetch__referencesSummary.isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <ReferencesList references={fetch__referencesSummary.value?.references ?? []}/>
    );
};

export default ReferencesEditor;
