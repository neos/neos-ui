import {sagas as BrowserSagas} from './Browser/index';
import {sagas as ChangesSagas} from './Changes/index';
import {sagas as CRSagas} from './CR/index';
import {sagas as PublishSagas} from './Publish/index';
import {sagas as ServerFeedbackSagas} from './ServerFeedback/index';
import {sagas as UISagas} from './UI/index';

export default [
    ...BrowserSagas,
    ...ChangesSagas,
    ...CRSagas,
    ...PublishSagas,
    ...ServerFeedbackSagas,
    ...UISagas
];
