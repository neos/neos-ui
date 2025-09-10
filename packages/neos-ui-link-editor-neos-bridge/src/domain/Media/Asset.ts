import {useAsync} from 'react-use';
import backend from '@neos-project/neos-ui-backend-connector';

export interface IAssetSummary {
    label: string
    preview: string
}

export function useAssetSummary(assetIdentifier: string) {
    return useAsync(async () => {
        const endpoints = backend.get().endpoints as {
            assetDetail: (assetIdentifier: string) => Promise<any>
        };

        const result = await endpoints.assetDetail(assetIdentifier);
        return result as null | IAssetSummary;
    }, [assetIdentifier]);
}
