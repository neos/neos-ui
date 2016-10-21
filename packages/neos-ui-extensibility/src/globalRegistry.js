import {SynchronousMetaRegistry} from './registry';
import {readFromConsumerApi} from './consumerApi';

export const globalRegistry = readFromConsumerApi('globalRegistry',
    () => new SynchronousMetaRegistry(`
        # A registry containing other registries that are added at runtime
    `)
);
