import {createDimensionSpacePointFromLegacyDimension} from '@neos-project/neos-ui-contentrepository/src/DimensionSpace';
import {fetchWithErrorHandling} from '@neos-project/neos-ui-backend-connector';
import {DimensionCombination} from '@neos-project/neos-ts-interfaces';

type GetReferencesSummaryQueryResultEnvelope =
    | {
        success: {
            references: {
                breadcrumbs: {
                    icon: string;
                    label: string;
                }[]
                icon: string;
                label: string;
                uri: string;
                properties: boolean;
            }[],
            propertySchema?: Record<string, any>,
            constraints?: Record<string, any>,
        }
    } | {
        error: {
            type: string;
            code: number;
            message: string;
        };
    };

export async function getReferencesSummary(workspaceName: string, legacyDimensionValues: DimensionCombination, nodeId: string, referenceName: string): Promise<GetReferencesSummaryQueryResultEnvelope> {
    const searchParams = new URLSearchParams();
    searchParams.set('workspaceName', workspaceName);

    const dimensionSpacePoint = createDimensionSpacePointFromLegacyDimension(legacyDimensionValues);

    searchParams.set('dimensionSpacePoint', JSON.stringify(dimensionSpacePoint));
    searchParams.set('nodeId', nodeId);

    searchParams.set('referenceName', referenceName);

    try {
        const response = await fetchWithErrorHandling.withCsrfToken(
            (csrfToken) => ({
                url:
                    '/neos/references-editor/get-references-summary?' +
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
