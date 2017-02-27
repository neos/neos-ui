import {sagas as PageTreeSagas} from './PageTree/index';
import {sagas as ContentTreeSagas} from './ContentTree/index';
import {sagas as InspectorSagas} from './Inspector/index';
import {sagas as ContentCanvas} from './ContentCanvas/index';

export const sagas = [
    ...PageTreeSagas,
    ...ContentTreeSagas,
    ...InspectorSagas,
    ...ContentCanvas
];
