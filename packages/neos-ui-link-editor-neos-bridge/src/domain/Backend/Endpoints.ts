import backend from '@neos-project/neos-ui-backend-connector';

export const endpoints = () => backend.get().endpoints as {
    assetDetail: (assetIdentifier: string) => Promise<any>
};
