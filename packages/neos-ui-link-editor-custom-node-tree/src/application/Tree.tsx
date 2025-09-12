/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */
import * as React from "react";
import { useAsync } from "react-use";

import { Tree as NeosTree } from "@neos-project/react-ui-components";

import { TreeNode } from "./TreeNode";
import { Search } from "./Search";
import { SelectNodeTypeFilter } from "./SelectNodeTypeFilter";
import { getTree } from "../infrastructure/http";
import {NestedError} from "@neos-project/neos-ui-error";

interface Props {
    initialSearchTerm?: string;
    initialNarrowNodeTypeFilter?: string;
    workspaceName: string;
    dimensionValues: Record<string, string[]>;
    startingPoint: string;
    loadingDepth: number;
    baseNodeTypeFilter: string;
    linkableNodeTypes?: string[];
    selectedTreeNodeId?: string;
    options?: {
        enableSearch?: boolean;
        enableNodeTypeFilter?: boolean;
    };
    onSelect(nodeId: string): void;
}

export const Tree: React.FC<Props> = (props) => {
    const [searchTerm, setSearchTerm] = React.useState<string>(
        props.initialSearchTerm ?? ""
    );
    const [narrowNodeTypeFilter, setNarrowNodeTypeFilter] =
        React.useState<string>(props.initialNarrowNodeTypeFilter ?? "");
    const fetch__getTree = useAsync(async () => {
        const result = await getTree({
            workspaceName: props.workspaceName,
            dimensionValues: props.dimensionValues,
            startingPoint: props.startingPoint,
            loadingDepth: props.loadingDepth,
            baseNodeTypeFilter: props.baseNodeTypeFilter,
            linkableNodeTypes: props.linkableNodeTypes,
            selectedNodeId: props.selectedTreeNodeId,
            narrowNodeTypeFilter,
            searchTerm,
        });

        if ("success" in result) {
            return result.success;
        }

        if ("error" in result) {
            throw result.error;
        }

        throw new Error("Something went wrong while fetching the tree.");
    }, [
        props.workspaceName,
        props.dimensionValues,
        props.startingPoint,
        props.loadingDepth,
        props.baseNodeTypeFilter,
        props.linkableNodeTypes,
        narrowNodeTypeFilter,
        searchTerm,
    ]);
    const handleTreeNodeClick = React.useCallback((treeNodeId: string) => {
        props.onSelect(treeNodeId);
    }, []);
    const handleSearchTermChange = React.useCallback(
        (newSearchTerm: string) => {
            setSearchTerm(newSearchTerm);
        },
        []
    );
    const handleNodeTypeFilterChange = React.useCallback(
        (newNodeTypeFilter: string) => {
            setNarrowNodeTypeFilter(newNodeTypeFilter);
        },
        []
    );

    let main;
    if (fetch__getTree.error) {
        throw NestedError.create(
            "NodeTree could not be loaded.",
            fetch__getTree.error,
        );
    } else if (fetch__getTree.loading || !fetch__getTree.value) {
        main = <div>Loading...</div>;
    } else {
        main = (
            <NeosTree>
                <TreeNode
                    workspaceName={props.workspaceName}
                    dimensionValues={props.dimensionValues}
                    baseNodeTypeFilter={props.baseNodeTypeFilter}
                    linkableNodeTypes={props.linkableNodeTypes}
                    treeNode={fetch__getTree.value.root}
                    selectedTreeNodeId={props.selectedTreeNodeId}
                    level={1}
                    onClick={handleTreeNodeClick}
                />
            </NeosTree>
        );
    }

    let search = null;
    if (props.options?.enableSearch) {
        search = (
            <Search
                initialValue={props.initialSearchTerm ?? ""}
                onChange={handleSearchTermChange}
            />
        );
    }

    let filter = null;
    if (props.options?.enableNodeTypeFilter) {
        filter = (
            <SelectNodeTypeFilter
                baseNodeTypeFilter={props.baseNodeTypeFilter}
                value={narrowNodeTypeFilter}
                onChange={handleNodeTypeFilterChange}
            />
        );
    }

    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                backgroundColor: "#141414",
                border: "1px solid #3f3f3f",
            }}
        >
            {search ? (
                <div
                    style={{
                        gridColumn: filter ? "1 / span 1" : "1 / span 2",
                    }}
                >
                    {search}
                </div>
            ) : null}
            {filter ? (
                <div
                    style={{
                        gridColumn: search ? "2 / span 1" : "1 / span 2",
                    }}
                >
                    {filter}
                </div>
            ) : null}
            {main ? (
                <div
                    style={{
                        marginTop: "-5px",
                        borderTop: "1px solid #3f3f3f",
                        gridColumn: "1 / span 2",
                        height: "50vh",
                        maxHeight: "300px",
                        overflowY: "auto",
                    }}
                >
                    {main}
                </div>
            ) : null}
        </div>
    );
};
