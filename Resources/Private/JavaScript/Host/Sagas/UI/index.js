import {sagas as PageTreeSagas} from './PageTree/index';
import {sagas as InspectorSagas} from './Inspector/index';

export const sagas = [
    ...PageTreeSagas,
    ...InspectorSagas
];
