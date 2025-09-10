/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */
import { fetchWithErrorHandling } from "@neos-project/neos-ui-backend-connector";

import { TreeNodeDTO } from "../../domain";

type GetChildrenForTreeNodeQuery = {
    workspaceName: string;
    dimensionValues: Record<string, string[]>;
    treeNodeId: string;
    nodeTypeFilter: string;
    linkableNodeTypes?: string[]
};

type GetChildrenForTreeNodeQueryResultEnvelope =
    | {
          success: {
              children: TreeNodeDTO[];
          };
      }
    | {
          error: {
              type: string;
              code: number;
              message: string;
          };
      };

export async function getChildrenForTreeNode(
    query: GetChildrenForTreeNodeQuery
): Promise<GetChildrenForTreeNodeQueryResultEnvelope> {
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
    searchParams.set("treeNodeId", query.treeNodeId);
    searchParams.set("nodeTypeFilter", query.nodeTypeFilter);

    for (const linkableNodeType of query.linkableNodeTypes ?? []) {
        searchParams.append(`linkableNodeTypes[]`, linkableNodeType);
    }

    try {
        const response = await fetchWithErrorHandling.withCsrfToken(
            (csrfToken) => ({
                url:
                    "/neos/link-editor/get-children-for-tree-node?" +
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
