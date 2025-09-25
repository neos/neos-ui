import {
    useConfiguration,
    useDimensionValues,
    usePersonalWorkspaceName,
    useSiteNodeAggregateId,
} from "@neos-project/neos-use";
import React from "react";
import {Tree} from "@neos-project/neos-node-tree";
import {useSelector, useDispatch, useStore} from "react-redux";
import {actions} from "@neos-project/neos-ui-redux-store";

export const DtoPageTree = () => {
    const workspaceName = usePersonalWorkspaceName();
    const dimensionValues = useDimensionValues();
    const siteNodeAggregateId = useSiteNodeAggregateId();
    const defaultLoadingDepth =
        useConfiguration((c) => c.nodeTree?.loadingDepth) ?? 4;
    const initialSearchTerm =
        useSelector((state) => state.ui?.pageTree?.query) ?? "";
    const initialNarrowNodeTypeFilter =
        useSelector((state) => state.ui?.pageTree?.filterNodeType) ??
        "";
    const startingPoint = siteNodeAggregateId;

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

    const _nodeAddressSerialised = useSelector((state) => state?.cr?.nodes?.documentNode);
    const currentNodeAddress = JSON.parse(_nodeAddressSerialised);

    const store = useStore();
    const dispatch = useDispatch();

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
        selectedTreeNodeId={currentNodeAddress.aggregateId}
        options={{
            enableSearch: true,
            enableNodeTypeFilter: true,
        }}
        onSelect={(nodeId) => {
            const newNodeAddress = {
                ...currentNodeAddress,
                aggregateId: nodeId,
            };

            // Append presetBaseNodeType param to src
            // const srcWithBaseNodeType = this.props.filterNodeType ? urlWithParams(
            //     node?.uri,
            //     {presetBaseNodeType: this.props.filterNodeType}
            // ) : node?.uri;

            const newNodeAddressSerialized = JSON.stringify(newNodeAddress);

            console.log(newNodeAddressSerialized);

            const newNode = store.getState().cr?.nodes?.byContextPath[newNodeAddressSerialized];

            dispatch(actions.UI.ContentCanvas.setSrc(newNode.uri))
            dispatch(actions.CR.Nodes.setDocumentNode(newNodeAddressSerialized))
        }}
    />;
};
