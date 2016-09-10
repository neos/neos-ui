import {sagas as ChangesSagas} from './Changes/index';
import {sagas as CRSagas} from './CR/index';
import {sagas as PublishSagas} from './Publish/index';
import {sagas as ServerFeedbackSagas} from './ServerFeedback/index';
import {sagas as SystemSagas} from './System/index';
import {sagas as UISagas} from './UI/index';
import {sagas as ViewSagas} from './View/index';

export default [
    ...ChangesSagas,
    ...CRSagas,
    ...PublishSagas,
    ...ServerFeedbackSagas,
    ...SystemSagas,
    ...UISagas,
    ...ViewSagas
];
