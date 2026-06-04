/*
 * This file is part of the Neos.Neos.Ui package.
 *
 * (c) Contributors of the Neos Project - www.neos.io
 *
 * This package is Open Source Software. For the full copyright and license
 * information, please view the LICENSE file which was distributed with this
 * source code.
 */
import {fetchWithErrorHandling} from '@neos-project/neos-ui-backend-connector';

import {TreeNodeDTO} from '../../domain';
import {ServerSideError} from '@neos-project/neos-ui-error';
import {createDimensionSpacePointFromLegacyDimension} from '@neos-project/neos-ui-contentrepository/src/DimensionSpace';

type GetTreeQuery = {
    workspaceName: string;
    legacyDimensionValues: Record<string, string[]>;
    startingPoint: string;
    loadingDepth: number;
    baseNodeTypeFilter: string;
    allowedNodeTypes?: string[];
    narrowNodeTypeFilter: string;
    searchTerm: string;
    selectedNodeIds?: string[];
};

type GetTreeQueryResultEnvelope =
    | {
          success: {
              root: TreeNodeDTO;
          };
      }
    | {
          error: ServerSideError;
      };

export async function getTree(
    query: GetTreeQuery
): Promise<GetTreeQueryResultEnvelope> {
    const searchParams = new URLSearchParams();
    const dimensionSpacePoint = createDimensionSpacePointFromLegacyDimension(query.legacyDimensionValues);

    searchParams.set('workspaceName', query.workspaceName);
    searchParams.set('dimensionSpacePoint', JSON.stringify(dimensionSpacePoint));
    searchParams.set('startingPoint', query.startingPoint);
    searchParams.set('loadingDepth', String(query.loadingDepth));
    searchParams.set('baseNodeTypeFilter', query.baseNodeTypeFilter);

    for (const allowedNodeType of query.allowedNodeTypes ?? []) {
        searchParams.append(`allowedNodeTypes[]`, allowedNodeType);
    }

    searchParams.set('narrowNodeTypeFilter', query.narrowNodeTypeFilter);
    searchParams.set('searchTerm', query.searchTerm);

    for (const referenceId of query.selectedNodeIds ?? []) {
        searchParams.append(`referenceIds[]`, referenceId);
    }

    try {
        const response = await fetchWithErrorHandling.withCsrfToken(
            (csrfToken) => ({
                url:
                    '/neos/references-editor/get-tree?' +
                    searchParams.toString(),
                method: 'GET',
                credentials: 'include',
                headers: {
                    'X-Flow-Csrftoken': csrfToken,
                    'Content-Type': 'application/json'
                }
            })
        );

        return fetchWithErrorHandling.parseJson(response);
    } catch (error) {
        fetchWithErrorHandling.generalErrorHandler(error as any);
        throw error;
    }
}
