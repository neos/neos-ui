import {useAsync} from 'react-use';

import backend from '@neos-project/neos-ui-backend-connector';

export interface IAssetSummary {
    label: string
    preview: string
}

export function useAssetSummary(assetIdentifier: string) {
    return useAsync(async () => {
        const result = await backend.get().endpoints.assetDetail(assetIdentifier);
        return result as null | IAssetSummary;
    }, [assetIdentifier]);
}
