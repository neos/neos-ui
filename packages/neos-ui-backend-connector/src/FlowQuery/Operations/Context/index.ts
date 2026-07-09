import {ContextProperties} from '@neos-project/neos-ui-contentrepository-model';

export default () => (contextProperties: ContextProperties) => ({
    type: 'context',
    payload: [contextProperties]
});
