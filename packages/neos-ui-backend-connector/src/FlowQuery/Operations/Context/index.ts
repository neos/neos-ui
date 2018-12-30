import {ContextProperties} from '@neos-project/neos-ts-interfaces';

export default () => (contextProperties: ContextProperties) => ({
    type: 'context',
    payload: [contextProperties]
});
