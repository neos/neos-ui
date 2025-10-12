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

import {NodeTypeFilterOptionDTO} from '../../domain';
import {ServerSideError} from '@neos-project/neos-ui-error';

type GetNodeTypeFilterOptionsQuery = {
    baseNodeTypeFilter: string;
};

type GetNodeTypeFilterOptionsQueryResultEnvelope =
    | {
          success: {
              options: NodeTypeFilterOptionDTO[];
          };
      }
    | {
          error: ServerSideError;
      };

export async function getNodeTypeFilterOptions(
    query: GetNodeTypeFilterOptionsQuery
): Promise<GetNodeTypeFilterOptionsQueryResultEnvelope> {
    const searchParams = new URLSearchParams();

    searchParams.set('baseNodeTypeFilter', query.baseNodeTypeFilter);

    try {
        const response = await fetchWithErrorHandling.withCsrfToken(
            (csrfToken) => ({
                url:
                    '/neos/link-editor/get-node-type-filter-options?' +
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
