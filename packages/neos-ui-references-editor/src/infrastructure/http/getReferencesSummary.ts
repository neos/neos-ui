import {DimensionCombination} from '@neos-project/neos-ts-interfaces';
import {fetchWithErrorHandling} from '@neos-project/neos-ui-backend-connector';

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

export async function getReferencesSummary(workspaceName: string, dimensionValues: DimensionCombination, nodeId: string, referenceIds: string[], referenceName: string): Promise<GetReferencesSummaryQueryResultEnvelope> {
    const searchParams = new URLSearchParams();
    searchParams.set('workspaceName', workspaceName);
    for (const [dimensionName, fallbackChain] of Object.entries(
        dimensionValues
    )) {
        for (const fallbackValue of fallbackChain) {
            searchParams.set(
                `dimensionValues[${dimensionName}][]`,
                fallbackValue
            );
        }
    }
    searchParams.set('nodeId', nodeId);

    if (referenceIds.length === 0) {
        searchParams.set('referenceIds[]', '');
    }
    referenceIds.forEach((referenceId, i) => {
        searchParams.set(`referenceIds[${i}]`, referenceId);
    });
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
