import {sagas as ContentDimensionSagas} from './ContentDimensions/index';
import {sagas as NodeOperationsSagas} from './NodeOperations/index';

export const sagas = [
    ...ContentDimensionSagas,
    ...NodeOperationsSagas
];
