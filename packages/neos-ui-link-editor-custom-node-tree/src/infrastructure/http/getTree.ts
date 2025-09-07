/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */
import { fetchWithErrorHandling } from "@neos-project/neos-ui-link-editor-neos-bridge";

import { TreeNodeDTO } from "../../domain";

type GetTreeQuery = {
    workspaceName: string;
    dimensionValues: Record<string, string[]>;
    startingPoint: string;
    loadingDepth: number;
    baseNodeTypeFilter: string;
    linkableNodeTypes?: string[];
    narrowNodeTypeFilter: string;
    searchTerm: string;
    selectedNodeId?: string;
};

type GetTreeQueryResultEnvelope =
    | {
          success: {
              root: TreeNodeDTO;
          };
      }
    | {
          error: {
              type: string;
              code: number;
              message: string;
          };
      };

export async function getTree(
    query: GetTreeQuery
): Promise<GetTreeQueryResultEnvelope> {
    const searchParams = new URLSearchParams();

    searchParams.set("workspaceName", query.workspaceName);
    for (const [dimensionName, fallbackChain] of Object.entries(
        query.dimensionValues
    )) {
        for (const fallbackValue of fallbackChain) {
            searchParams.set(
                `dimensionValues[${dimensionName}][]`,
                fallbackValue
            );
        }
    }
    searchParams.set("startingPoint", query.startingPoint);
    searchParams.set("loadingDepth", String(query.loadingDepth));
    searchParams.set("baseNodeTypeFilter", query.baseNodeTypeFilter);

    for (const linkableNodeType of query.linkableNodeTypes ?? []) {
        searchParams.append(`linkableNodeTypes[]`, linkableNodeType);
    }

    searchParams.set("narrowNodeTypeFilter", query.narrowNodeTypeFilter);
    searchParams.set("searchTerm", query.searchTerm);

    if (query.selectedNodeId) {
        searchParams.set("selectedNodeId", query.selectedNodeId);
    }

    try {
        const response = await fetchWithErrorHandling.withCsrfToken(
            (csrfToken) => ({
                url:
                    "/neos/link-editor/get-tree?" +
                    searchParams.toString(),
                method: "GET",
                credentials: "include",
                headers: {
                    "X-Flow-Csrftoken": csrfToken,
                    "Content-Type": "application/json",
                },
            })
        );

        return fetchWithErrorHandling.parseJson(response);
    } catch (error) {
        fetchWithErrorHandling.generalErrorHandler(error as any);
        throw error;
    }
}
