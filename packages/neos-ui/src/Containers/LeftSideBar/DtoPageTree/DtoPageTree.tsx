import {
    useConfiguration,
    useDimensionValues,
    usePersonalWorkspaceName,
    useSelector,
    useSiteNodeContextPath
} from "@neos-project/neos-use";
import React from "react";
import {Tree} from "@neos-project/neos-node-tree";

export const DtoPageTree = () => {
    const workspaceName = usePersonalWorkspaceName();
    const dimensionValues = useDimensionValues();
    const siteNodeContextPath = useSiteNodeContextPath();
    const defaultLoadingDepth =
        useConfiguration((c) => c.nodeTree?.loadingDepth) ?? 4;
    const initialSearchTerm =
        useSelector((state) => state.ui?.pageTree?.query) ?? "";
    const initialNarrowNodeTypeFilter =
        useSelector((state) => state.ui?.pageTree?.filterNodeType) ??
        "";
    const startingPoint = siteNodeContextPath?.path;

    if (!startingPoint) {
        throw new Error(
            "Could not load node tree, because startingPoint could not be determined."
        );
    } else if (!workspaceName) {
        throw new Error(
            "Could not load node tree, because workspaceName could not be determined."
        );
    } else if (!dimensionValues) {
        throw new Error(
            "Could not load node tree, because dimensionValues could not be determined."
        );
    }
    return <Tree
        initialSearchTerm={initialSearchTerm}
        workspaceName={workspaceName}
        dimensionValues={dimensionValues}
        startingPoint={startingPoint}
        loadingDepth={defaultLoadingDepth}
        baseNodeTypeFilter={"Neos.Neos:Document"}
        initialNarrowNodeTypeFilter={
            initialNarrowNodeTypeFilter
        }
        linkableNodeTypes={
            undefined // todo remove
        }
        selectedTreeNodeId={undefined}
        options={{
            enableSearch: true,
            enableNodeTypeFilter: true,
        }}
        onSelect={(nodeId) => console.log(nodeId)}
    />;
};
