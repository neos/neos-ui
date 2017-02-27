import {sagas as PageTreeSagas} from './PageTree/index';
import {sagas as InspectorSagas} from './Inspector/index';
import {sagas as ContentCanvas} from './ContentCanvas/index';
import {sagas as EditPreviewMode} from './EditPreviewMode/index';

export const sagas = [
    ...PageTreeSagas,
    ...InspectorSagas,
    ...ContentCanvas,
    ...EditPreviewMode
];
