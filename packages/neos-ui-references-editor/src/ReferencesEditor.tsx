import React from 'react';
import {getReferencesSummary} from './infrastructure/http';
import {usePromise} from '@neos-project/framework-promise-react';
import {selectors, useSelector} from '@neos-project/neos-ui-redux-store';
import {ErrorView} from "@neos-project/neos-ui-error";
import {HoverActions} from "./presentation/HoverActions";
import {ReferencesItem} from "./presentation/ReferencesItem";

export const ReferencesEditor = (props) => {
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
                    <HoverActions key={reference.uri} onEdit={() => {}} onDelete={() => {}}>
                        <ReferencesItem reference={reference} isDraggable={(fetch__referencesSummary.value?.references?.length ?? 0) > 1}/>
                    </HoverActions>
                );
            })}
        </>
    );
};
