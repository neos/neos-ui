import {useAsync} from 'react-use';

import { endpoints } from '../Backend';

export interface IAssetSummary {
    label: string
    preview: string
}

export function useAssetSummary(assetIdentifier: string) {
    return useAsync(async () => {
        const result = await endpoints().assetDetail(assetIdentifier);
        return result as null | IAssetSummary;
    }, [assetIdentifier]);
}